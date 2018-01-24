import {
  AUTOCOMPLETE_OFF, ClsConfig, DynamicInputModel, DynamicInputModelConfig,
  serializable
} from '@ng-dynamic-forms/core';
import {
  DynamicScrollableDropdownModel,
  DynamicScrollableDropdownModelConfig
} from '../scrollable-dropdown/dynamic-scrollable-dropdown.model';

export const DYNAMIC_FORM_CONTROL_TYPE_LOOKUP = 'LOOKUP';

export interface DynamicLookupModelConfig extends DynamicScrollableDropdownModelConfig {
  // authorityMetadata: string;
  // authorityName: string;
  // authorityScope: string;
  // minChars: number;
  value: any;
  separator: string;
}

export class DynamicLookupModel extends DynamicScrollableDropdownModel {// DynamicInputModel {

  @serializable() authorityMetadata: string;
  @serializable() authorityName: string;
  @serializable() authorityScope: string;
  @serializable() minChars: number;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_LOOKUP;
  @serializable() value: any;
  @serializable() separator: string; // Defined only for lookup-name

  constructor(config: DynamicLookupModelConfig, cls?: ClsConfig) {

    super(config, cls);

    this.autoComplete = AUTOCOMPLETE_OFF;
    this.authorityMetadata = config.authorityMetadata;
    this.authorityName = config.authorityName;
    this.authorityScope = config.authorityScope;
    this.separator = config.separator; // Defined only for lookup-name
  }

}
