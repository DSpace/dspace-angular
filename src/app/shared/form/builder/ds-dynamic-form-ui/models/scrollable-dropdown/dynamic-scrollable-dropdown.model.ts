import { AUTOCOMPLETE_OFF, DynamicFormControlLayout, serializable } from '@ng-dynamic-forms/core';
import { DsDynamicInputModel, DsDynamicInputModelConfig } from '../ds-dynamic-input.model';
import { VocabularyOptions } from '../../../../../../core/submission/vocabularies/models/vocabulary-options.model';
import { FindAllDataImpl } from '../../../../../../core/data/base/find-all-data';
import { CacheableObject } from '../../../../../../core/cache/cacheable-object.model';

export const DYNAMIC_FORM_CONTROL_TYPE_SCROLLABLE_DROPDOWN = 'SCROLLABLE_DROPDOWN';

export interface DynamicScrollableDropdownModelConfig extends DsDynamicInputModelConfig {
  vocabularyOptions?: VocabularyOptions;
  maxOptions?: number;
  value?: any;
  displayKey?: string;
  formatFunction?: (value: any) => string;
  findAllFactory?: () =>  FindAllDataImpl<CacheableObject>;
}

export class DynamicScrollableDropdownModel extends DsDynamicInputModel {

  @serializable() maxOptions: number;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_SCROLLABLE_DROPDOWN;
  @serializable() displayKey: string;
  /**
   * Configurable function for display value formatting in input
   */
  formatFunction: (value: any) => string;
  /**
   * Factory for a service that implements FindAllData
   */
  findAllFactory: () =>  FindAllDataImpl<CacheableObject>;

  constructor(config: DynamicScrollableDropdownModelConfig, layout?: DynamicFormControlLayout) {

    super(config, layout);

    this.autoComplete = AUTOCOMPLETE_OFF;
    this.vocabularyOptions = config.vocabularyOptions;
    this.maxOptions = config.maxOptions || 10;
    this.displayKey = config.displayKey || 'display';
    this.formatFunction = config.formatFunction;
    this.findAllFactory = config.findAllFactory || (() => null);
  }

}
