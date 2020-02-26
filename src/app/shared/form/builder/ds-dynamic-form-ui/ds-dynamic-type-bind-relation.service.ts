import { Inject, Injectable, Injector, Optional } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';
import { distinctUntilChanged, startWith } from 'rxjs/operators';

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

import { isUndefined } from '../../../empty.util';
import { FormBuilderService } from '../form-builder.service';

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

      const value = (isUndefined(bindModel.value) || typeof bindModel.value === 'string') ? bindModel.value : bindModel.value.value;

      if (bindModel && relation.match === matcher.match) {

        if (index > 0 && operator === AND_OPERATOR && !hasAlreadyMatched) {
          return false;
        }

        if (index > 0 && operator === OR_OPERATOR && hasAlreadyMatched) {
          return true;
        }

        return condition.value === value;
      }

      if (bindModel && relation.match === matcher.opposingMatch) {

        if (index > 0 && operator === AND_OPERATOR && hasAlreadyMatched) {
          return true;
        }

        if (index > 0 && operator === OR_OPERATOR && !hasAlreadyMatched) {
          return false;
        }

        return !(condition.value === value);
      }

      return false;

    }, false);
  }

  subscribeRelations(model: DynamicFormControlModel, control: FormControl): Subscription[] {

    const relatedModels = this.getRelatedFormModel(model);
    const subscriptions: Subscription[] = [];

    Object.values(relatedModels).forEach((relatedModel: any) => {

      const initValue = (isUndefined(relatedModel.value) || typeof relatedModel.value === 'string') ? relatedModel.value : relatedModel.value.value;

      const valueChanges = relatedModel.valueUpdates.pipe(
        startWith(initValue),
        distinctUntilChanged()
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
    });

    return subscriptions;
  }
}
