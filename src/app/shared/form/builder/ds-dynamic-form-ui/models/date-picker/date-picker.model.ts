import {
  DynamicDateControlModel,
  DynamicDateControlModelConfig,
  DynamicFormControlLayout,
  serializable
} from '@ng-dynamic-forms/core';

import { Subject } from 'rxjs';

export const DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER = 'DATE';

/**
 * Dynamic Date Picker Model class
 */
export class DynamicDsDatePickerModel extends DynamicDateControlModel {
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER;
  valueUpdates: Subject<any>;
  malformedDate: boolean;
  hasLanguages = false;
  repeatable = false;

  constructor(config: DynamicDateControlModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.malformedDate = false;
  }

}
