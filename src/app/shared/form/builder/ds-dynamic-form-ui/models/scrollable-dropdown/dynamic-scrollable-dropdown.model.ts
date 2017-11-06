import {
  AUTOCOMPLETE_OFF, ClsConfig, DynamicInputModel, DynamicInputModelConfig,
  serializable
} from '@ng-dynamic-forms/core';
import { Observable } from 'rxjs/Observable';
import { PageInfo } from '../../../../../../core/shared/page-info.model';

export const DYNAMIC_FORM_CONTROL_TYPE_SCROLLABLE_DROPDOWN = 'SCROLLABLE_DROPDOWN';

export interface DynamicScrollableDropdownResponseModel {
  list: any[];
  pageInfo: PageInfo;
}

export interface DynamicScrollableDropdownModelConfig extends DynamicInputModelConfig {
  maxOptions: number;
  retrieve: (pageInfo: PageInfo) => Observable<DynamicScrollableDropdownResponseModel>;
}

export class DynamicScrollableDropdownModel extends DynamicInputModel {

  @serializable() maxOptions: number;
  retrieve: (pageInfo: PageInfo) => Observable<any>;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_SCROLLABLE_DROPDOWN;

  constructor(config: DynamicScrollableDropdownModelConfig, cls?: ClsConfig) {

    super(config, cls);

    this.autoComplete = AUTOCOMPLETE_OFF;
    this.maxOptions = config.maxOptions;
    this.retrieve = config.retrieve;
  }

}
