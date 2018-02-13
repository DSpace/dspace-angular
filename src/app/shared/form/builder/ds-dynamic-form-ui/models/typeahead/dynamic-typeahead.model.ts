import { AUTOCOMPLETE_OFF, DynamicFormControlLayout, serializable } from '@ng-dynamic-forms/core';
import { DsDynamicInputModel, DsDynamicInputModelConfig } from '../ds-dynamic-input.model';

export const DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD = 'TYPEAHEAD';

export interface DsDynamicTypeaheadModelConfig extends DsDynamicInputModelConfig {
  authorityMetadata: string;
  authorityName: string;
  authorityScope: string;
  minChars: number;
  value: any;
}

export class DynamicTypeaheadModel extends DsDynamicInputModel {

  @serializable() authorityMetadata: string;
  @serializable() authorityName: string;
  @serializable() authorityScope: string;
  @serializable() minChars: number;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD;

  constructor(config: DsDynamicTypeaheadModelConfig, layout?: DynamicFormControlLayout) {

    super(config, layout);

    this.autoComplete = AUTOCOMPLETE_OFF;
    this.authorityMetadata = config.authorityMetadata;
    this.authorityName = config.authorityName;
    this.authorityScope = config.authorityScope;
    this.minChars = config.minChars;
  }

}
