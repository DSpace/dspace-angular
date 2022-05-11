import {
  DynamicDateControlModel,
  DynamicDatePickerModelConfig,
  DynamicFormControlLayout,
  serializable
} from '@ng-dynamic-forms/core';

export const DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER = 'DATE';

export interface DynamicDsDateControlModelConfig extends DynamicDatePickerModelConfig {
  legend?: string;
}

/**
 * Dynamic Date Picker Model class
 */
export class DynamicDsDatePickerModel extends DynamicDateControlModel {
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER;
  malformedDate: boolean;
  legend: string;
  hasLanguages = false;
  repeatable = false;

  constructor(config: DynamicDsDateControlModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.malformedDate = false;
    this.legend = config.legend;
  }

}
