import {
  ClsConfig,
  DynamicCheckboxGroupModel,
  DynamicFormGroupModelConfig, DynamicRadioGroupModel, DynamicRadioGroupModelConfig,
  serializable
} from '@ng-dynamic-forms/core';
import { AuthorityModel } from '../../../../../../core/integration/models/authority.model';

export interface DynamicListModelConfig extends DynamicRadioGroupModelConfig<any> {
  authorityMetadata: string;
  authorityName: string;
  authorityScope: string;
  groupLength: number;
  repeatable: boolean;
  storedValue: any;
}

export class DynamicListRadioGroupModel extends DynamicRadioGroupModel<any> {

  @serializable() authorityMetadata: string;
  @serializable() authorityName: string;
  @serializable() authorityScope: string;
  @serializable() repeatable: boolean;
  @serializable() groupLength: number;
  @serializable() storedValue: any;
  @serializable() internalValue: AuthorityModel[];

  constructor(config: DynamicListModelConfig, cls?: ClsConfig) {
    super(config, cls);

    this.authorityMetadata = config.authorityMetadata;
    this.authorityName = config.authorityName;
    this.authorityScope = config.authorityScope;
    this.groupLength = config.groupLength || 5;
    this.internalValue = [];
    this.repeatable = config.repeatable;
    this.storedValue = config.storedValue;
  }

}
