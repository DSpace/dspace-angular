import {
  DynamicFormArrayModel, DynamicFormArrayModelConfig, DynamicFormControlLayout,
  serializable
} from '@ng-dynamic-forms/core';

export interface DynamicRowArrayModelConfig extends DynamicFormArrayModelConfig {
  notRepeteable: boolean;
}

export class DynamicRowArrayModel extends DynamicFormArrayModel {
  @serializable() notRepeteable = false;

  constructor(config: DynamicRowArrayModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.notRepeteable = config.notRepeteable;
  }

}
