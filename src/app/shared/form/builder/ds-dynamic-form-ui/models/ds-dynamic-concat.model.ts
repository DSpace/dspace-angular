import { ClsConfig, DynamicFormGroupModel, DynamicFormGroupModelConfig, serializable } from '@ng-dynamic-forms/core';
import { isNotEmpty } from '../../../../empty.util';
import { DsDynamicInputModel } from './ds-dynamic-input.model';

export const CONCAT_GROUP_SUFFIX = '_CONCAT_GROUP';
export const CONCAT_FIRST_INPUT_SUFFIX = '_CONCAT_FIRST_INPUT';
export const CONCAT_SECOND_INPUT_SUFFIX = '_CONCAT_SECOND_INPUT';

export const SERIES_GROUP_SUFFIX = '_SERIES_GROUP';
export const SERIES_INPUT_1_SUFFIX = '_SERIES_INPUT_1';
export const SERIES_INPUT_2_SUFFIX = '_SERIES_INPUT_2';

export const NAME_GROUP_SUFFIX = '_NAME_GROUP';
export const NAME_INPUT_1_SUFFIX = '_NAME_INPUT_1';
export const NAME_INPUT_2_SUFFIX = '_NAME_INPUT_2';

export interface DynamicConcatModelConfig extends DynamicFormGroupModelConfig {
  separator: string;
}

export class DynamicConcatModel  extends DynamicFormGroupModel {

  @serializable() separator: string;

  constructor(config: DynamicConcatModelConfig, cls?: ClsConfig) {

    super(config, cls);

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

  set value(value: string) {
    const  values = value.split(this.separator);

    if (values.length > 1) {
      (this.get(0) as DsDynamicInputModel).valueUpdates.next(values[0]);
      (this.get(1) as DsDynamicInputModel).valueUpdates.next(values[1]);
    }
  }
}
