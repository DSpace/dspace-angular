import { Injectable } from '@angular/core';

import {
  DYNAMIC_FORM_CONTROL_ACTION_DISABLE,
  DYNAMIC_FORM_CONTROL_ACTION_ENABLE,
  DYNAMIC_FORM_CONTROL_CONNECTIVE_AND,
  DYNAMIC_FORM_CONTROL_CONNECTIVE_OR,
  DynamicFormControlModel,
  DynamicFormControlRelation,
  DynamicFormControlRelationGroup
} from '@ng-dynamic-forms/core';

import { isUndefined } from '../../../empty.util';
import { FormBuilderService } from '../form-builder.service';

@Injectable()
export class DsDynamicTypeBindRelationService {

  constructor(protected formBuilderService: FormBuilderService) {

  }

  public getRelatedFormModel(model: DynamicFormControlModel): DynamicFormControlModel[] {

    const models: DynamicFormControlModel[] = [];

    (model as any).typeBind.forEach((relGroup) => relGroup.when.forEach((rel) => {

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

  public isFormControlToBeHidden(relGroup: DynamicFormControlRelationGroup): boolean {

    return relGroup.when.reduce((toBeDisabled: boolean, rel: DynamicFormControlRelation, index: number) => {

      const bindModel: any = this.formBuilderService.getTypeBindModel();

      const value = (isUndefined(bindModel.value) || typeof bindModel.value === 'string') ? bindModel.value : bindModel.value.value;

      if (bindModel && relGroup.action === DYNAMIC_FORM_CONTROL_ACTION_DISABLE) {

        if (index > 0 && relGroup.connective === DYNAMIC_FORM_CONTROL_CONNECTIVE_AND && !toBeDisabled) {
          return false;
        }

        if (index > 0 && relGroup.connective === DYNAMIC_FORM_CONTROL_CONNECTIVE_OR && toBeDisabled) {
          return true;
        }

        return rel.value === value;
      }

      if (bindModel && relGroup.action === DYNAMIC_FORM_CONTROL_ACTION_ENABLE) {

        if (index > 0 && relGroup.connective === DYNAMIC_FORM_CONTROL_CONNECTIVE_AND && toBeDisabled) {
          return true;
        }

        if (index > 0 && relGroup.connective === DYNAMIC_FORM_CONTROL_CONNECTIVE_OR && !toBeDisabled) {
          return false;
        }

        return isUndefined(value) || !(rel.value === value);
      }

      return false;

    }, false);
  }
}
