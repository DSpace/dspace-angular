import { DynamicFormArrayModel, DynamicFormArrayModelConfig, DynamicFormControlLayout, serializable } from '@ng-dynamic-forms/core';

export interface DynamicRowArrayModelConfig extends DynamicFormArrayModelConfig {
  notRepeatable: boolean;
  required: boolean;
}

export class DynamicRowArrayModel extends DynamicFormArrayModel {
  @serializable() notRepeatable = false;
  @serializable() required = false;
  isRowArray = true;

  constructor(config: DynamicRowArrayModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.notRepeatable = config.notRepeatable;
    this.required = config.required;
  }
}
