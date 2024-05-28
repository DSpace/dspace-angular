import { AUTOCOMPLETE_OFF, DynamicFormControlLayout, serializable } from '@ng-dynamic-forms/core';
import { DsDynamicInputModel, DsDynamicInputModelConfig } from '../ds-dynamic-input.model';

export const DYNAMIC_FORM_CONTROL_TYPE_LINK = 'LINK';

export interface DsDynamicLinkModelConfig extends DsDynamicInputModelConfig {
  value?: any;
  submissionScope?: string;
}

export class DynamicLinkModel extends DsDynamicInputModel {

  @serializable() minChars: number;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_LINK;
  @serializable() submissionScope: string;

  constructor(config: DsDynamicLinkModelConfig, layout?: DynamicFormControlLayout) {

    super(config, layout);

    this.autoComplete = AUTOCOMPLETE_OFF;
    this.submissionScope = config.submissionScope;
  }

}
