import {
  DynamicCheckboxModel,
  DynamicCheckboxModelConfig,
  DynamicFormControlLayout,
  serializable
} from '@ng-dynamic-forms/core';

export const DYNAMIC_FORM_CONTROL_TYPE_CUSTOM_SWITCH = 'CUSTOM_SWITCH';

export class DynamicCustomSwitchModel extends DynamicCheckboxModel {
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_CUSTOM_SWITCH;

  constructor(config: DynamicCheckboxModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
  }
}
