import { DynamicFormGroupModel } from '@ng-dynamic-forms/core';
import { DsDynamicInputModel } from './ds-dynamic-input.model';

export const COMBOBOX_GROUP_SUFFIX = '_COMBO_GROUP';
export const COMBOBOX_METADATA_SUFFIX = '_COMBO_METADATA';
export const COMBOBOX_VALUE_SUFFIX = '_COMBO_VALUE';

export class DynamicComboboxModel  extends DynamicFormGroupModel {

  get value() {
   return (this.get(1) as DsDynamicInputModel).value;
  }

  get qualdropId(): string {
    return (this.get(0) as DsDynamicInputModel).value.toString();
  }
}
