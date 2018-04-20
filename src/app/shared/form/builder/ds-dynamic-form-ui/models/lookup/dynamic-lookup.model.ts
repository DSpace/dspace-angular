import { AUTOCOMPLETE_OFF, DynamicFormControlLayout, serializable } from '@ng-dynamic-forms/core';
import { AuthorityModel } from '../../../../../../core/integration/models/authority.model';
import { DsDynamicInputModel, DsDynamicInputModelConfig } from '../ds-dynamic-input.model';
import { AuthorityOptions } from '../../../../../../core/integration/models/authority-options.model';

export const DYNAMIC_FORM_CONTROL_TYPE_LOOKUP = 'LOOKUP';

export interface DynamicLookupModelConfig extends DsDynamicInputModelConfig {
  authorityOptions: AuthorityOptions;
  maxOptions: number;
  value: any;
  separator: string;
}

export class DynamicLookupModel extends DsDynamicInputModel {
  @serializable() authorityOptions: AuthorityOptions;
  @serializable() maxOptions: number;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_LOOKUP;
  @serializable() value: any;
  @serializable() separator: string; // Defined only for lookup-name

  @serializable() placeholder: string;
  @serializable() placeholder2: string;

  constructor(config: DynamicLookupModelConfig, layout?: DynamicFormControlLayout) {

    super(config, layout);

    this.autoComplete = AUTOCOMPLETE_OFF;
    this.authorityOptions = config.authorityOptions;
    this.maxOptions = config.maxOptions;
    this.separator = config.separator; // Defined only for lookup-name

    this.valueUpdates.next(config.value);
    // this.valueUpdates.subscribe(() => {
    //   this.setInputsValue();
    // });
  }
}
