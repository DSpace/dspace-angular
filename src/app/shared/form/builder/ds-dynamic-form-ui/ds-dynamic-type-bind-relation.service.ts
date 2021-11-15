import { Inject, Injectable, Injector, Optional } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

import {
  AND_OPERATOR,
  DYNAMIC_MATCHERS,
  DynamicFormControlCondition,
  DynamicFormControlMatcher,
  DynamicFormControlModel,
  DynamicFormControlRelation,
  DynamicFormRelationService,
  OR_OPERATOR
} from '@ng-dynamic-forms/core';

import { isNotUndefined, isUndefined } from '../../../empty.util';
import { FormBuilderService } from '../form-builder.service';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP } from './ds-dynamic-form-constants';

@Injectable()
export class DsDynamicTypeBindRelationService {

  constructor(@Optional() @Inject(DYNAMIC_MATCHERS) private dynamicMatchers: DynamicFormControlMatcher[],
              protected dynamicFormRelationService: DynamicFormRelationService,
              protected formBuilderService: FormBuilderService,
              protected injector: Injector) {

  }

  public getRelatedFormModel(model: DynamicFormControlModel): DynamicFormControlModel[] {

    const models: DynamicFormControlModel[] = [];

    (model as any).typeBindRelations.forEach((relGroup) => relGroup.when.forEach((rel) => {

      if (model.id === rel.id) {
        throw new Error(`FormControl ${model.id} cannot depend on itself`);
      }

      const bindModel: DynamicFormControlModel = this.formBuilderService.getTypeBindModel();

      if (model && !models.some((modelElement) => modelElement === bindModel)) {
        models.push(bindModel);
      }
    }));

    return models;
  }

  public matchesCondition(relation: DynamicFormControlRelation, matcher: DynamicFormControlMatcher): boolean {

    const operator = relation.operator || OR_OPERATOR;

    return relation.when.reduce((hasAlreadyMatched: boolean, condition: DynamicFormControlCondition, index: number) => {

      const bindModel: any = this.formBuilderService.getTypeBindModel();

      let values: string[];
      let bindModelValue = bindModel.value;

      if (bindModel.type === DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP) {
        bindModelValue = bindModel.value.map((entry) => entry[bindModel.mandatoryField]);
      }
      if (Array.isArray(bindModelValue)) {
        values = [...bindModelValue.map((entry) => this.getTypeBindValue(entry))];
      } else {
        values = [this.getTypeBindValue(bindModelValue)];
      }

      let returnValue = (!(bindModel && relation.match === matcher.match));
      for (const value of values) {
        if (bindModel && relation.match === matcher.match) {

          if (index > 0 && operator === AND_OPERATOR && !hasAlreadyMatched) {
            return false;
          }

          if (index > 0 && operator === OR_OPERATOR && hasAlreadyMatched) {
            return true;
          }

          returnValue = condition.value === value;

          if (returnValue) {
            break;
          }
        }

        if (bindModel && relation.match === matcher.opposingMatch) {

          if (index > 0 && operator === AND_OPERATOR && hasAlreadyMatched) {
            return true;
          }

          if (index > 0 && operator === OR_OPERATOR && !hasAlreadyMatched) {
            return false;
          }

          returnValue = !(condition.value === value);

          if (!returnValue) {
            break;
          }
        }
      }
      return returnValue;

    }, false);
  }

  subscribeRelations(model: DynamicFormControlModel, control: FormControl): Subscription[] {

    const relatedModels = this.getRelatedFormModel(model);
    const subscriptions: Subscription[] = [];

    Object.values(relatedModels).forEach((relatedModel: any) => {

      if (isNotUndefined(relatedModel)) {
        const initValue = (isUndefined(relatedModel.value) || typeof relatedModel.value === 'string') ? relatedModel.value :
          (Array.isArray(relatedModel.value) ? relatedModel.value : relatedModel.value.value);

        const valueChanges = relatedModel.valueChanges.pipe(
          startWith(initValue)
        );

        subscriptions.push(valueChanges.subscribe(() => {

          this.dynamicMatchers.forEach((matcher) => {

            const relation = this.dynamicFormRelationService.findRelationByMatcher((model as any).typeBindRelations, matcher);

            if (relation !== undefined) {

              const hasMatch = this.matchesCondition(relation, matcher);
              matcher.onChange(hasMatch, model, control, this.injector);
            }
          });
        }));
      }
    });

    return subscriptions;
  }

  /**
   * Return the string value of the type bind model
   * @param bindModelValue
   * @private
   */
  private getTypeBindValue(bindModelValue: string | FormFieldMetadataValueObject): string {
    let value;
    if (isUndefined(bindModelValue) || typeof bindModelValue === 'string') {
      value = bindModelValue;
    } else if (bindModelValue.hasAuthority()) {
      value = bindModelValue.authority;
    } else {
      value = bindModelValue.value;
    }

    return value;
  }
}
