import { DynamicFormArrayModel, DynamicFormArrayModelConfig, DynamicFormControlLayout, serializable } from '@ng-dynamic-forms/core';

export interface DynamicRowArrayModelConfig extends DynamicFormArrayModelConfig {
  notRepeatable: boolean;
  required: boolean;
  submissionId: string;
  hasRelationship: boolean;
  metadataKey: string;
}

export class DynamicRowArrayModel extends DynamicFormArrayModel {
  @serializable() notRepeatable = false;
  @serializable() required = false;
  @serializable() submissionId: string;
  @serializable() hasRelationship: boolean;
  @serializable() metadataKey: string;
  isRowArray = true;

  constructor(config: DynamicRowArrayModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.notRepeatable = config.notRepeatable;
    this.required = config.required;
    this.submissionId = config.submissionId;
    this.hasRelationship = config.hasRelationship;
    this.metadataKey = config.metadataKey;
  }
}
