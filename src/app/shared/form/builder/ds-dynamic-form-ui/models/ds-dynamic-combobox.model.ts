
import { DynamicFormGroupModel, DynamicInputModel } from '@ng-dynamic-forms/core';

export const COMBOBOX_GROUP_SUFFIX = '_COMBO_GROUP';
export const COMBOBOX_METADATA_SUFFIX = '_COMBO_METADATA';
export const COMBOBOX_VALUE_SUFFIX = '_COMBO_VALUE';

export class DynamicComboboxModel  extends DynamicFormGroupModel {

  get value() {
   return (this.get(1) as DynamicInputModel).value;
  }

  get qualdropId(): string {
    return (this.get(0) as DynamicInputModel).value.toString();
  }
}
