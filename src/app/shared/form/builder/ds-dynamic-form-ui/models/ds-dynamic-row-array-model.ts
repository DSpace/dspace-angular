import {
  DynamicFormArrayModel,
  DynamicFormArrayModelConfig,
  DynamicFormControlLayout,
  serializable
} from '@ng-dynamic-forms/core';
import { isNotUndefined } from '../../../../empty.util';

export interface DynamicRowArrayModelConfig extends DynamicFormArrayModelConfig {
  notRepeatable: boolean;
  required: boolean;
  showButtons: boolean;
}

export class DynamicRowArrayModel extends DynamicFormArrayModel {
  @serializable() notRepeatable = false;
  @serializable() required = false;
  @serializable() showButtons = true;
  isRowArray = true;

  constructor(config: DynamicRowArrayModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
    if (isNotUndefined(config.notRepeatable)) {
      this.notRepeatable = config.notRepeatable;
    }
    if (isNotUndefined(config.required)) {
      this.required = config.required;
    }
    if (isNotUndefined(config.showButtons)) {
      this.showButtons = config.showButtons;
    }
  }

}
