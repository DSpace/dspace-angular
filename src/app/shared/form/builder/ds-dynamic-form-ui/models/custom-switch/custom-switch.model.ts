import { serializable } from "@ng-dynamic-forms/core/decorator/serializable.decorator";
import { DynamicCheckboxModel, DynamicCheckboxModelConfig } from "@ng-dynamic-forms/core/model/checkbox/dynamic-checkbox.model";
import { DynamicFormControlLayout } from "@ng-dynamic-forms/core/model/misc/dynamic-form-control-layout.model";


export const DYNAMIC_FORM_CONTROL_TYPE_CUSTOM_SWITCH = 'CUSTOM_SWITCH';

/**
 * Model class for displaying a custom switch input in a form
 * Functions like a checkbox, but displays a switch instead
 */
export class DynamicCustomSwitchModel extends DynamicCheckboxModel {
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_CUSTOM_SWITCH;

  constructor(config: DynamicCheckboxModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
  }
}
