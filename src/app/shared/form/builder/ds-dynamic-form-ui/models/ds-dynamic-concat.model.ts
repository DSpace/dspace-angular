import { DynamicFormControlLayout, DynamicFormGroupModel, DynamicFormGroupModelConfig, serializable } from '@ng-dynamic-forms/core';
import { isNotEmpty } from '../../../../empty.util';
import { DsDynamicInputModel } from './ds-dynamic-input.model';
import { AuthorityValueModel } from '../../../../../core/integration/models/authority-value.model';

export const CONCAT_GROUP_SUFFIX = '_CONCAT_GROUP';
export const CONCAT_FIRST_INPUT_SUFFIX = '_CONCAT_FIRST_INPUT';
export const CONCAT_SECOND_INPUT_SUFFIX = '_CONCAT_SECOND_INPUT';

export interface DynamicConcatModelConfig extends DynamicFormGroupModelConfig {
  separator: string;
}

export class DynamicConcatModel extends DynamicFormGroupModel {

  @serializable() separator: string;
  @serializable() hasLanguages = false;

  constructor(config: DynamicConcatModelConfig, layout?: DynamicFormControlLayout) {

    super(config, layout);

    this.separator = config.separator + ' ';
  }

  get value() {
    const firstValue = (this.get(0) as DsDynamicInputModel).value;
    const secondValue = (this.get(1) as DsDynamicInputModel).value;
    if (isNotEmpty(firstValue) && isNotEmpty(secondValue)) {
      return firstValue + this.separator + secondValue;
    } else {
      return null
    }
  }

  set value(value: string | AuthorityValueModel) {
    let values;
    if (typeof value === 'string') {
      values =  value ? value.split(this.separator) : [null, null];
    } else {
      values =  value ? value.value.split(this.separator) : [null, null];
    }

    if (values.length > 1) {
      (this.get(0) as DsDynamicInputModel).valueUpdates.next(values[0]);
      (this.get(1) as DsDynamicInputModel).valueUpdates.next(values[1]);
    }
  }

}
