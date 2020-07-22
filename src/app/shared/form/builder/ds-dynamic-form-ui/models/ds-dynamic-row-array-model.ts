import { DynamicFormArrayModel, DynamicFormArrayModelConfig, DynamicFormControlLayout, serializable } from '@ng-dynamic-forms/core';
import { RelationshipOptions } from '../../models/relationship-options.model';

export interface DynamicRowArrayModelConfig extends DynamicFormArrayModelConfig {
  notRepeatable: boolean;
  required: boolean;
  submissionId: string;
  relationshipConfig: RelationshipOptions;
  metadataKey: string;
  metadataFields: string[];
  hasSelectableMetadata: boolean;
}

export class DynamicRowArrayModel extends DynamicFormArrayModel {
  @serializable() notRepeatable = false;
  @serializable() required = false;
  @serializable() submissionId: string;
  @serializable() relationshipConfig: RelationshipOptions;
  @serializable() metadataKey: string;
  @serializable() metadataFields: string[];
  @serializable() hasSelectableMetadata: boolean;
  isRowArray = true;

  constructor(config: DynamicRowArrayModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.notRepeatable = config.notRepeatable;
    this.required = config.required;
    this.submissionId = config.submissionId;
    this.relationshipConfig = config.relationshipConfig;
    this.metadataKey = config.metadataKey;
    this.metadataFields = config.metadataFields;
    this.hasSelectableMetadata = config.hasSelectableMetadata;
  }
}
