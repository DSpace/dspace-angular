import {
  AUTOCOMPLETE_OFF, ClsConfig, DynamicInputModel, DynamicInputModelConfig,
  serializable
} from '@ng-dynamic-forms/core';
import { Observable } from 'rxjs/Observable';
import { PageInfo } from '../../../../../../core/shared/page-info.model';

export const DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD = 'TYPEAHEAD';

export interface DynamicTypeaheadResponseModel {
  list: any[];
  pageInfo: PageInfo;
}

export interface DynamicTypeaheadModelConfig extends DynamicInputModelConfig {
  minChars: number;
  search: (text: string) => Observable<DynamicTypeaheadResponseModel>;
}

export class DynamicTypeaheadModel extends DynamicInputModel {

  minChars: number;
  search: (text: string) => Observable<DynamicTypeaheadResponseModel>;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD;

  constructor(config: DynamicTypeaheadModelConfig, cls?: ClsConfig) {

    super(config, cls);

    this.autoComplete = AUTOCOMPLETE_OFF;
    this.minChars = config.minChars;
    this.search = config.search;
  }

}
