import {
  AUTOCOMPLETE_OFF, ClsConfig, DynamicInputModel, DynamicInputModelConfig,
  serializable
} from '@ng-dynamic-forms/core';
import { Observable } from 'rxjs/Observable';
import { PageInfo } from '../../../../../../core/shared/page-info.model';

export const DYNAMIC_FORM_CONTROL_TYPE_SCROLLABLE_DROPDOWN = 'SCROLLABLE_DROPDOWN';

export interface DynamicScrollableDropdownModelConfig extends DynamicInputModelConfig {
  authorityMetadata: string;
  authorityName: string;
  authorityScope: string;
  maxOptions: number;
  value: any;
}

export class DynamicScrollableDropdownModel extends DynamicInputModel {

  @serializable() authorityMetadata: string;
  @serializable() authorityName: string;
  @serializable() authorityScope: string;
  @serializable() maxOptions: number;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_SCROLLABLE_DROPDOWN;

  constructor(config: DynamicScrollableDropdownModelConfig, cls?: ClsConfig) {

    super(config, cls);

    this.autoComplete = AUTOCOMPLETE_OFF;
    this.authorityMetadata = config.authorityMetadata;
    this.authorityName = config.authorityName;
    this.authorityScope = config.authorityScope;
    this.maxOptions = config.maxOptions;
  }

}
