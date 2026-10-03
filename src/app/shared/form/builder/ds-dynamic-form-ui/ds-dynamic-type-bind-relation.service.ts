import {
  ChangeDetectorRef,
  Inject,
  Injectable,
  Injector,
  Optional,
} from '@angular/core';
import {
  FormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP } from '@dspace/core/shared/form/ds-dynamic-form-constants';
import { FormFieldMetadataValueObject } from '@dspace/core/shared/form/models/form-field-metadata-value.model';
import {
  hasNoValue,
  hasValue,
  isNotNull,
} from '@dspace/shared/utils/empty.util';
import {
  AND_OPERATOR,
  DYNAMIC_FORM_CONTROL_TYPE_ARRAY,
  DYNAMIC_MATCHERS,
  DynamicFormControlCondition,
  DynamicFormControlMatcher,
  DynamicFormControlModel,
  DynamicFormControlRelation,
  DynamicFormRelationService,
  OR_OPERATOR,
} from '@ng-dynamic-forms/core';
import { Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
} from 'rxjs/operators';

import { FormBuilderService } from '../form-builder.service';

/**
 * Service to manage type binding for submission input fields
 * Any form component with the typeBindRelations DynamicFormControlRelation property can be controlled this way
 */
@Injectable({ providedIn: 'root' })
export class DsDynamicTypeBindRelationService {
  activatedSubscriptionsByMetadataKey = new Set<string>();

  constructor(@Optional() @Inject(DYNAMIC_MATCHERS) private dynamicMatchers: DynamicFormControlMatcher[],
              protected dynamicFormRelationService: DynamicFormRelationService,
              protected formBuilderService: FormBuilderService,
              protected injector: Injector) {
  }

  /**
   * Return the string value of the type bind model
   * @param bindModelValue
   * @private
   */
  public getTypeBindValue(bindModelValue: string | FormFieldMetadataValueObject): string {
    let value;
    if (hasNoValue(bindModelValue) || typeof bindModelValue === 'string') {
      value = bindModelValue;
    } else if (bindModelValue instanceof FormFieldMetadataValueObject
      && bindModelValue.hasAuthority()) {
      value = bindModelValue.authority;
    } else {
      value = bindModelValue.value;
    }

    return value;
  }


  /**
   * Get models or (parent array-)controls for a model with type bind
   *
   * @param model
   * @param formGroup
   */
  public getRelatedFormModel(model: DynamicFormControlModel, formGroup: UntypedFormGroup): Array<DynamicFormControlModel | FormArray> {

    const models: Array<DynamicFormControlModel | FormArray> = [];
    let parentControl: any;

    (model as any).typeBindRelations.forEach((relGroup) => relGroup.when.forEach((rel) => {

      if (model.id === rel.id) {
        throw new Error(`FormControl ${model.id} cannot depend on itself`);
      }

      const bindModel: DynamicFormControlModel = this.formBuilderService.getTypeBindModels(rel.id);

      if (!parentControl && formGroup && bindModel && this.isPartOfArrayWithRepeatableItems(bindModel)) {
        parentControl = this.formBuilderService.findControlByModel((bindModel.parent as any).context, formGroup);
      }

      if (!parentControl) {
        if (model && !models.some((modelElement) => modelElement === bindModel)) {
          models.push(bindModel);
        }
      }
    }));

    if (parentControl && !models.some((modelElement) => modelElement === parentControl)) {
      models.push(parentControl);
    }

    return models;
  }

  /**
   * Return false if the type bind relation (eg. {MATCH_VISIBLE, OR, ['book', 'book part']}) matches the value in
   * matcher.match or true if the opposite match. Since this is called with regard to actively *hiding* a form
   * component, the negation of the comparison is returned.
   * @param relation type bind relation (eg. {MATCH_VISIBLE, OR, ['book', 'book part']})
   * @param matcher contains 'match' value and an onChange() event listener
   * @param latestChanges
   */
  public matchesCondition(relation: DynamicFormControlRelation, matcher: DynamicFormControlMatcher, latestChanges?: any): boolean {

    // Default to OR for operator (OR is explicitly set in field-parser.ts anyway)
    const operator = relation.operator || OR_OPERATOR;

    return relation.when.reduce((hasAlreadyMatched: boolean, condition: DynamicFormControlCondition, index: number) => {
      // Get the DynamicFormControlModel (typeBindModel) from the form builder service, set in the form builder
      // in the form model at init time in formBuilderService.modelFromConfiguration (called by other form components
      // like relation group component and submission section form component).
      // This model (DynamicRelationGroupModel) contains eg. mandatory field, formConfiguration, relationFields,
      // submission scope, form/section type and other high level properties
      const bindModel: any = this.formBuilderService.getTypeBindModels(condition.id);

      let values: string[];
      let bindModelValue = bindModel.value;

      // If the form type is RELATION, set bindModelValue to the mandatory field for this model, otherwise leave
      // as plain value
      if (bindModel.type === DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP) {
        bindModelValue = bindModel.value.map((entry) => entry[bindModel.mandatoryField]);
      }

      // Support multiple bind models
      if (latestChanges && Array.isArray(latestChanges)) {
        values = latestChanges.map((entry) => {
          if (entry[condition.id]) {
            return this.getTypeBindValue(entry[condition.id]);
          } else {
            return this.getTypeBindValue(entry);
          }
        });
      } else if (Array.isArray(bindModelValue)) {
        values = [...bindModelValue.map((entry) => this.getTypeBindValue(entry))];
      } else {
        values = [this.getTypeBindValue(bindModelValue)];
      }

      // If bind model evaluates to 'true' (is not undefined, is not null, is not false etc,
      // AND the relation match (type bind) is equal to the matcher match (item publication type), then the return
      // value is initialised as false.
      let returnValue = (!(bindModel && relation.match === matcher.match));

      // Iterate the type bind values parsed and mapped from our form/relation group model
      for (const value of values) {
        if (bindModel && relation.match === matcher.match) {
          // If we're not at the first array element, and we're using the AND operator, and we have not
          // yet matched anything, return false.
          if (index > 0 && operator === AND_OPERATOR && !hasAlreadyMatched) {
            return false;
          }
          // If we're not at the first array element, and we're using the OR operator (almost always the case)
          // and we've already matched then there is no need to continue, just return true.
          if (index > 0 && operator === OR_OPERATOR && hasAlreadyMatched) {
            return true;
          }

          // Do the actual match. Does condition.value (the item publication type) match the field model
          // type bind currently being inspected?
          returnValue = condition.value === value;

          // If return value is already true, break.
          if (returnValue) {
            break;
          }
        }

        // Test opposingMatch (eg. if match is VISIBLE, opposingMatch will be HIDDEN)
        if (bindModel && relation.match === matcher.opposingMatch) {
          // If we're not at the first element, using AND, and already matched, just return true here
          if (index > 0 && operator === AND_OPERATOR && hasAlreadyMatched) {
            return true;
          }

          // If we're not at the first element, using OR, and we have NOT already matched, return false
          if (index > 0 && operator === OR_OPERATOR && !hasAlreadyMatched) {
            return false;
          }

          // Negated comparison for return value since this is expected to be in the context of a HIDDEN_MATCHER
          returnValue = !(condition.value === value);

          // Break if already false
          if (!returnValue) {
            break;
          }
        }
      }
      return returnValue;
    }, false);
  }

  /**
   * Return an array of subscriptions to a calling component
   * @param model
   * @param control
   * @param formGroup
   * @param compRef
   */
  subscribeRelations(model: DynamicFormControlModel, control: UntypedFormControl, formGroup: UntypedFormGroup, compRef: ChangeDetectorRef): Subscription[] {
    const relatedControlsOrModels: Array<DynamicFormControlModel | FormArray> = this.getRelatedFormModel(model, formGroup);

    return Object.values(relatedControlsOrModels).filter((relatedModel) => hasValue(relatedModel)).map((relatedModel) => {
      const isFormArray = relatedModel instanceof FormArray;

      const initialValue = this.getInitialRelatedModelValue(relatedModel);
      let valueUpdates$;

      if (isFormArray) {
        valueUpdates$ = relatedModel.valueChanges;
      } else if ((relatedModel as any).type === 'CHECKBOX_GROUP') {
        valueUpdates$ = (relatedModel as any).valueUpdates;
      } else {
        valueUpdates$ = (relatedModel as any).valueChanges;
      }

      return valueUpdates$.pipe(
        startWith(initialValue),
        distinctUntilChanged(),
        debounceTime(150),
      ).subscribe((changedValues: any) => {
        this.applyMatcher(model, control, compRef, isFormArray ? changedValues : undefined);
      });
    });
  }

  private getInitialRelatedModelValue(relatedModel: DynamicFormControlModel | FormArray) {
    const value = (relatedModel as any).value;

    if (hasNoValue(value) || typeof value === 'string' || Array.isArray(value)) {
      return value;
    }

    return value.value;
  }

  private applyMatcher(model: DynamicFormControlModel, control: UntypedFormControl, compRef: ChangeDetectorRef, latestChanges: any) {
    if (!hasValue(this.dynamicMatchers)) {
      return;
    }

    this.dynamicMatchers.forEach((matcher) => {
      const relation = this.dynamicFormRelationService.findRelationByMatcher((model as any).typeBindRelations, matcher);

      if (relation === undefined) {
        return;
      }

      const hasMatch = this.matchesCondition(relation, matcher, latestChanges);
      matcher.onChange(hasMatch, model, control, this.injector);
      compRef.markForCheck();
    });
  }

  private isPartOfArrayWithRepeatableItems(model: DynamicFormControlModel): boolean {
    return (isNotNull(model.parent) &&
      (model.parent as any).context &&
      (model.parent as any).context.type === DYNAMIC_FORM_CONTROL_TYPE_ARRAY &&
      (model.parent as any).context.notRepeatable === false);
  }
}
