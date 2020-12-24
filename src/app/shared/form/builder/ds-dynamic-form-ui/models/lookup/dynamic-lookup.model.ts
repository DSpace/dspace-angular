import { AUTOCOMPLETE_OFF, DynamicFormControlLayout, serializable } from '@ng-dynamic-forms/core';
import { DsDynamicInputModel, DsDynamicInputModelConfig } from '../ds-dynamic-input.model';

export const DYNAMIC_FORM_CONTROL_TYPE_LOOKUP = 'LOOKUP';

export interface DynamicLookupModelConfig extends DsDynamicInputModelConfig {
  maxOptions?: number;
  value?: any;
  submissionScope?: string;
}

export class DynamicLookupModel extends DsDynamicInputModel {

  @serializable() maxOptions: number;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_LOOKUP;
  @serializable() value: any;
  @serializable() submissionScope: string;

  constructor(config: DynamicLookupModelConfig, layout?: DynamicFormControlLayout) {

    super(config, layout);

    this.autoComplete = AUTOCOMPLETE_OFF;
    this.maxOptions = config.maxOptions || 10;
    this.submissionScope = config.submissionScope;

    this.valueUpdates.next(config.value);
  }
}
