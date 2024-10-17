import { DsDynamicInputModel, DsDynamicInputModelConfig } from '../ds-dynamic-input.model';
import { AUTOCOMPLETE_OFF, DynamicFormControlLayout, serializable } from '@ng-dynamic-forms/core';
import { VocabularyOptions } from '../../../../../../core/submission/vocabularies/models/vocabulary-options.model';
import { isEmpty } from '../../../../../empty.util';

export const DYNAMIC_FORM_CONTROL_TYPE_AUTOCOMPLETE = 'AUTOCOMPLETE';
export const AUTOCOMPLETE_COMPLEX_PREFIX = 'autocomplete_in_complex_input';
export const DEFAULT_MIN_CHARS_TO_AUTOCOMPLETE = 1;
export const AUTOCOMPLETE_CUSTOM_SOLR_PREFIX = 'solr-';
export const AUTOCOMPLETE_CUSTOM_JSON_PREFIX = 'json_static-';

/**
 * Configuration for the DsDynamicAutocompleteModel.
 */
export interface DsDynamicAutocompleteModelConfig extends DsDynamicInputModelConfig {
  minChars?: number;
  value?: any;
  autocompleteCustom?: string;
}

/**
 * The model for the Autocomplete input field.
 */
export class DsDynamicAutocompleteModel extends DsDynamicInputModel {

  @serializable() minChars: number;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_AUTOCOMPLETE;
  @serializable() autocompleteCustom: string;

  constructor(config: DsDynamicAutocompleteModelConfig, layout?: DynamicFormControlLayout) {

    super(config, layout);

    if (isEmpty(this.vocabularyOptions)) {
      this.vocabularyOptions = new VocabularyOptions('none');
    }
    this.autoComplete = AUTOCOMPLETE_OFF;
    // if minChars is not defined in the configuration -> load default value
    this.minChars = config.minChars || DEFAULT_MIN_CHARS_TO_AUTOCOMPLETE;
    // if value is not defined in the configuration -> value is empty
    this.value = config.value || [];
    this.autocompleteCustom = config.autocompleteCustom;
  }
}
