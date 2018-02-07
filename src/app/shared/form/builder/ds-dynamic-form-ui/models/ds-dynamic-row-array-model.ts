import { DynamicFormArrayModel, DynamicFormArrayModelConfig, serializable } from '@ng-dynamic-forms/core';
import { ClsConfig } from '@ng-dynamic-forms/core/src/model/dynamic-form-control.model';

export interface DynamicRowArrayModelConfig extends DynamicFormArrayModelConfig {
  notRepeteable: boolean;
}

export class DynamicRowArrayModel extends DynamicFormArrayModel {
  @serializable() notRepeteable = false;

  constructor(config: DynamicRowArrayModelConfig, cls: ClsConfig) {
    super(config, cls);
    this.notRepeteable = config.notRepeteable;
  }

}
