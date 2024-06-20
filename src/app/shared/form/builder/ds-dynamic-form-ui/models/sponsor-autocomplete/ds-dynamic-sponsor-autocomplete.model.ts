import { DsDynamicInputModel, DsDynamicInputModelConfig } from '../ds-dynamic-input.model';
import { AUTOCOMPLETE_OFF, DynamicFormControlLayout, serializable } from '@ng-dynamic-forms/core';
import { VocabularyOptions } from '../../../../../../core/submission/vocabularies/models/vocabulary-options.model';
import { isEmpty } from '../../../../../empty.util';

export const DYNAMIC_FORM_CONTROL_TYPE_AUTOCOMPLETE = 'AUTOCOMPLETE';
export const DEFAULT_MIN_CHARS_TO_AUTOCOMPLETE = 3;
export const DEFAULT_MAX_CHARS_TO_AUTOCOMPLETE = 200;

export const DEFAULT_EU_DISPLAY_VALUE = 'EU';
export const DEFAULT_EU_STORAGE_VALUE = 'euFunds';
export const DEFAULT_EU_FUNDING_TYPES = [DEFAULT_EU_DISPLAY_VALUE, DEFAULT_EU_STORAGE_VALUE];

/**
 * Configuration for the DsDynamicSponsorAutocompleteModel.
 */
export interface DsDynamicSponsorAutocompleteModelConfig extends DsDynamicInputModelConfig {
  minChars?: number;
  value?: any;
}

/**
 * The Model for the DsDynamicSponsorAutocompleteComponent.
 */
export class DsDynamicSponsorAutocompleteModel extends DsDynamicInputModel {

  @serializable() minChars: number;
  @serializable() maxLength: number;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_AUTOCOMPLETE;

  constructor(config: DsDynamicSponsorAutocompleteModelConfig, layout?: DynamicFormControlLayout) {

    super(config, layout);

    if (isEmpty(this.vocabularyOptions)) {
      this.vocabularyOptions = new VocabularyOptions('none');
    }
    this.autoComplete = AUTOCOMPLETE_OFF;
    // if minChars is not defined in the configuration -> load default value
    this.minChars = config.minChars || DEFAULT_MIN_CHARS_TO_AUTOCOMPLETE;
    this.maxLength = config.maxLength || DEFAULT_MAX_CHARS_TO_AUTOCOMPLETE;
    // if value is not defined in the configuration -> value is empty
    this.value = config.value || [];
  }
}
