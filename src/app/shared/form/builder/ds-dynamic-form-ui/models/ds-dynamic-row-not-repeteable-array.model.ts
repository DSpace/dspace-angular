import { DynamicRowArrayModel } from './ds-dynamic-row-array-model';
import { serializable } from '@ng-dynamic-forms/core';

export const DYNAMIC_FORM_CONTROL_TYPE_NOT_REPETEABLE_ARRAY = 'NOT_REPETEABLE_ARRAY';

export class DynamicRowNotRepeteableArrayModel extends DynamicRowArrayModel {
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_NOT_REPETEABLE_ARRAY;
}
