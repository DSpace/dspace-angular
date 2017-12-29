import {
  ClsConfig,
  DynamicCheckboxGroupModel,
  DynamicFormGroupModelConfig,
  serializable
} from '@ng-dynamic-forms/core';
import { AuthorityModel } from '../../../../../../core/integration/models/authority.model';

export interface DynamicListCheckboxGroupModelConfig extends DynamicFormGroupModelConfig {
  authorityMetadata: string;
  authorityName: string;
  authorityScope: string;
  groupLength: number;
  repeatable: boolean;
  storedValue: any;
}

export class DynamicListCheckboxGroupModel extends DynamicCheckboxGroupModel {

  @serializable() authorityMetadata: string;
  @serializable() authorityName: string;
  @serializable() authorityScope: string;
  @serializable() repeatable: boolean;
  @serializable() groupLength: number;
  @serializable() storedValue: any;
  @serializable() internalValue: AuthorityModel[];

  constructor(config: DynamicListCheckboxGroupModelConfig, cls?: ClsConfig) {
    super(config, cls);

    this.authorityMetadata = config.authorityMetadata;
    this.authorityName = config.authorityName;
    this.authorityScope = config.authorityScope;
    this.groupLength = config.groupLength || 5;
    this.internalValue = [];
    this.repeatable = config.repeatable;
    this.storedValue = config.storedValue;
  }

  get value() {
    return this.internalValue;
  }
}
