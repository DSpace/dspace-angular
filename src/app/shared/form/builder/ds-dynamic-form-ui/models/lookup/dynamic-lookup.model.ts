import { AUTOCOMPLETE_OFF, DynamicFormControlLayout, serializable } from '@ng-dynamic-forms/core';
import { AuthorityModel } from '../../../../../../core/integration/models/authority.model';
import { DsDynamicInputModel, DsDynamicInputModelConfig } from '../ds-dynamic-input.model';

export const DYNAMIC_FORM_CONTROL_TYPE_LOOKUP = 'LOOKUP';

export interface DynamicLookupModelConfig extends DsDynamicInputModelConfig {
  authorityMetadata: string;
  authorityName: string;
  authorityScope: string;
  maxOptions: number;
  value: any;
  separator: string;
}

export class DynamicLookupModel extends DsDynamicInputModel {
  @serializable() authorityMetadata: string;
  @serializable() authorityName: string;
  @serializable() authorityScope: string;
  @serializable() maxOptions: number;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_LOOKUP;
  @serializable() value: any;
  @serializable() separator: string; // Defined only for lookup-name

  @serializable() currentValue: string; // Input value
  @serializable() currentValue2: string; // Input value

  @serializable() placeholder: string;
  @serializable() placeholder2: string;

  constructor(config: DynamicLookupModelConfig, layout?: DynamicFormControlLayout) {

    super(config, layout);

    this.autoComplete = AUTOCOMPLETE_OFF;
    this.authorityMetadata = config.authorityMetadata;
    this.authorityName = config.authorityName;
    this.authorityScope = config.authorityScope;
    this.maxOptions = config.maxOptions;
    this.separator = config.separator; // Defined only for lookup-name

    this.valueUpdates.subscribe(() => {
      this.assignCurrentValues();
    });
  }

  assignCurrentValues() {
    let x = this.value;
    if (this.value instanceof AuthorityModel) {
      x = this.value.display;
    }

    if (this.separator) {
      let values = ['', ''  ];
      if (x) {
        // console.log('Splitting ' + x);
        values = x.split(this.separator);
      }

      this.currentValue = values[0];
      this.currentValue2 = values[1];
    } else {
      this.currentValue = x || '';
    }
  }

}
