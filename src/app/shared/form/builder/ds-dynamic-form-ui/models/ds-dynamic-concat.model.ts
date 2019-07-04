import { DynamicFormControlLayout, DynamicFormGroupModel, DynamicFormGroupModelConfig, serializable } from '@ng-dynamic-forms/core';

import { Subject } from 'rxjs';

import { isNotEmpty } from '../../../../empty.util';
import { DsDynamicInputModel } from './ds-dynamic-input.model';
import { FormFieldMetadataValueObject } from '../../models/form-field-metadata-value.model';

export const CONCAT_GROUP_SUFFIX = '_CONCAT_GROUP';
export const CONCAT_FIRST_INPUT_SUFFIX = '_CONCAT_FIRST_INPUT';
export const CONCAT_SECOND_INPUT_SUFFIX = '_CONCAT_SECOND_INPUT';

export interface DynamicConcatModelConfig extends DynamicFormGroupModelConfig {
  separator: string;
}

export class DynamicConcatModel extends DynamicFormGroupModel {

  @serializable() separator: string;
  @serializable() hasLanguages = false;
  isCustomGroup = true;
  valueUpdates: Subject<string>;

  constructor(config: DynamicConcatModelConfig, layout?: DynamicFormControlLayout) {

    super(config, layout);

    this.separator = config.separator + ' ';

    this.valueUpdates = new Subject<string>();
    this.valueUpdates.subscribe((value: string) => this.value = value);
  }

  get value() {
    const firstValue = (this.get(0) as DsDynamicInputModel).value;
    const secondValue = (this.get(1) as DsDynamicInputModel).value;

    if (isNotEmpty(firstValue) && isNotEmpty(secondValue)) {
      return new FormFieldMetadataValueObject(firstValue + this.separator + secondValue);
    } else if (isNotEmpty(firstValue)) {
      return new FormFieldMetadataValueObject(firstValue);
    } else {
      return null;
    }
  }

  set value(value: string | FormFieldMetadataValueObject) {
    let values;
    let tempValue: string;

    if (typeof value === 'string') {
      tempValue =  value;
    } else {
      tempValue = value.value;
    }

    if (tempValue.includes(this.separator)) {
      values = tempValue.split(this.separator);
    } else {
      values = [tempValue, null];
    }

    if (values[0]) {
      (this.get(0) as DsDynamicInputModel).valueUpdates.next(values[0]);
    }
    if (values[1]) {
      (this.get(1) as DsDynamicInputModel).valueUpdates.next(values[1]);
    }
  }

}
