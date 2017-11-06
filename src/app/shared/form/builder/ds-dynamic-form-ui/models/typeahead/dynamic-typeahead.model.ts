import {
  AUTOCOMPLETE_OFF, ClsConfig, DynamicInputModel, DynamicInputModelConfig,
  serializable
} from '@ng-dynamic-forms/core';
import { Observable } from 'rxjs/Observable';

export const DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD = 'TYPEAHEAD';

export interface DynamicTypeaheadModelConfig extends DynamicInputModelConfig {
  minChars: number;
  search: (text: string) => Observable<any[]>;
}

export class DynamicTypeaheadModel extends DynamicInputModel {

  minChars: number;
  search: (text: string) => Observable<any[]>;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD;

  constructor(config: DynamicTypeaheadModelConfig, cls?: ClsConfig) {

    super(config, cls);

    this.autoComplete = AUTOCOMPLETE_OFF;
    this.minChars = config.minChars;
    this.search = config.search;
  }

}
