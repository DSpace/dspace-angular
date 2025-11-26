import { serializable } from "@ng-dynamic-forms/core/decorator/serializable.decorator";
import {
  DsDynamicInputModel,
  DsDynamicInputModelConfig,
} from '../ds-dynamic-input.model';
import { DynamicFormControlLayout } from "@ng-dynamic-forms/core/model/misc/dynamic-form-control-layout.model";
import { AUTOCOMPLETE_OFF } from "@ng-dynamic-forms/core/utils/autofill.utils";

export const DYNAMIC_FORM_CONTROL_TYPE_TAG = 'TAG';

export interface DynamicTagModelConfig extends DsDynamicInputModelConfig {
  minChars?: number;
  value?: any;
}

export class DynamicTagModel extends DsDynamicInputModel {

  @serializable() minChars: number;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_TAG;

  constructor(config: DynamicTagModelConfig, layout?: DynamicFormControlLayout) {

    super(config, layout);

    this.autoComplete = AUTOCOMPLETE_OFF;
    this.minChars = config.minChars || 3;
    const value = config.value || [];
    this.value = value;
  }

}
