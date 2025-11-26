import { serializable } from "@ng-dynamic-forms/core/decorator/serializable.decorator";
import {
  DsDynamicInputModel,
  DsDynamicInputModelConfig,
} from './ds-dynamic-input.model';
import { DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA } from "@ng-dynamic-forms/core/model/textarea/dynamic-textarea.model";
import { DynamicFormControlLayout } from "@ng-dynamic-forms/core/model/misc/dynamic-form-control-layout.model";

export interface DsDynamicTextAreaModelConfig extends DsDynamicInputModelConfig {
  cols?: number;
  rows?: number;
  wrap?: string;
}

export class DsDynamicTextAreaModel extends DsDynamicInputModel {
  @serializable() cols: number;
  @serializable() rows: number;
  @serializable() wrap: string;
  @serializable() type = DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA;

  constructor(config: DsDynamicTextAreaModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);

    this.cols = config.cols;
    this.rows = config.rows;
    this.wrap = config.wrap;
  }

}
