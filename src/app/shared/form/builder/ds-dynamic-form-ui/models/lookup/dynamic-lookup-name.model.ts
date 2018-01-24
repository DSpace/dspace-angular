import {
  AUTOCOMPLETE_OFF, ClsConfig, DynamicInputModel, DynamicInputModelConfig,
  serializable
} from '@ng-dynamic-forms/core';
import { DynamicLookupModel, DynamicLookupModelConfig } from './dynamic-lookup.model';
import { isNotEmpty } from '../../../../../empty.util';

export const DYNAMIC_FORM_CONTROL_TYPE_LOOKUP_NAME = 'LOOKUP_NAME';

export interface DynamicLookupNameModelConfig extends DynamicLookupModelConfig {
  // authorityMetadata: string;
  // authorityName: string;
  // authorityScope: string;
  // minChars: number;
  // value: any;
  separator: string;
}

export class DynamicLookupNameModel extends DynamicLookupModel {
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_LOOKUP_NAME;
  @serializable() separator: string;

  constructor(config: DynamicLookupNameModelConfig, cls?: ClsConfig) {
    super(config, cls);
    this.separator = config.separator;

    // this.autoComplete = AUTOCOMPLETE_OFF;
    // this.authorityMetadata = config.authorityMetadata;
    // this.authorityName = config.authorityName;
    // this.authorityScope = config.authorityScope;
    // this.minChars = config.minChars;
  }

  // get value() {
  //   const values = this.value.split(this.separator);
  //   const firstValue = values[0];
  //   const secondValue = values[1];
  //   if (isNotEmpty(firstValue) && isNotEmpty(secondValue)) {
  //     return firstValue + this.separator + secondValue;
  //   } else {
  //     return null
  //   }
  // }
  //
  // set value(value: string) {
  //   const  values = value.split(this.separator);
  //
  //   if (values.length > 1) {
  //     (this.get(0) as DynamicInputModel).valueUpdates.next(values[0]);
  //     (this.get(1) as DynamicInputModel).valueUpdates.next(values[1]);
  //   }
  // }

}
