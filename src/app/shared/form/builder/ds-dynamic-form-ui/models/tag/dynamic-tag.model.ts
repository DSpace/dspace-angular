import { AUTOCOMPLETE_OFF, ClsConfig, serializable } from '@ng-dynamic-forms/core';
import { DsDynamicInputModel, DsDynamicInputModelConfig } from '../ds-dynamic-input.model';

export const DYNAMIC_FORM_CONTROL_TYPE_TAG = 'TYPETAG';

export interface DynamicTagModelConfig extends DsDynamicInputModelConfig {
  authorityMetadata: string;
  authorityName: string;
  authorityScope: string;
  minChars: number;
  value?: any;
  // chips: Chips;
}

export class DynamicTagModel extends DsDynamicInputModel {

  @serializable() authorityMetadata: string;
  @serializable() authorityName: string;
  @serializable() authorityScope: string;
  @serializable() minChars: number;
  @serializable() value: any[];
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_TAG;
  // @serializable() chips: Chips;

  constructor(config: DynamicTagModelConfig, cls?: ClsConfig) {

    super(config, cls);

    this.autoComplete = AUTOCOMPLETE_OFF;
    this.authorityMetadata = config.authorityMetadata;
    this.authorityName = config.authorityName;
    this.authorityScope = config.authorityScope;
    this.minChars = config.minChars;
    // this.chips = config.chips || new Chips();
    const value = config.value || [];
    this.valueUpdates.next(value)
  }

  // get value() {
  //   const out = [];
  //   this.chips.chipsItems.forEach((item) => {
  //     out.push(item.item);
  //   });
  //
  //   return out;
  // }

  // set value(value: any[]) {
  //   // this.chips.chipsItems = value;
  // }

}
