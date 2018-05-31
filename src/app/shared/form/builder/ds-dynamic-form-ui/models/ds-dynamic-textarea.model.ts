import {
  DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA,
  DynamicFormControlLayout, DynamicTextAreaModel, DynamicTextAreaModelConfig,
  serializable
} from '@ng-dynamic-forms/core';
import { Subject } from 'rxjs/Subject';
import { LanguageCode } from '../../models/form-field-language-value.model';
import { DsDynamicInputModel, DsDynamicInputModelConfig } from './ds-dynamic-input.model';

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
