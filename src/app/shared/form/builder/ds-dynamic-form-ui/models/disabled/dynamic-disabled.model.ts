import { serializable } from "@ng-dynamic-forms/core/decorator/serializable.decorator";
import {
  DsDynamicInputModel,
  DsDynamicInputModelConfig,
} from '../ds-dynamic-input.model';
import { DynamicFormControlLayout } from "@ng-dynamic-forms/core/model/misc/dynamic-form-control-layout.model";

export const DYNAMIC_FORM_CONTROL_TYPE_DISABLED = 'EMPTY';

export interface DsDynamicDisabledModelConfig extends DsDynamicInputModelConfig {
  value?: any;
  hasSelectableMetadata: boolean;
}

/**
 * This model represents the data for a disabled input field
 */
export class DynamicDisabledModel extends DsDynamicInputModel {

  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_DISABLED;
  @serializable() hasSelectableMetadata: boolean;

  constructor(config: DsDynamicDisabledModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.readOnly = true;
    this.disabled = true;
    this.hasSelectableMetadata = config.hasSelectableMetadata;

    this.value = config.value;
  }
}
