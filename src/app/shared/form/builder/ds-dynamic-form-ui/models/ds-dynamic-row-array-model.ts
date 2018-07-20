import {
  DYNAMIC_FORM_CONTROL_TYPE_ARRAY,
  DynamicFormArrayModel, DynamicFormArrayModelConfig, DynamicFormControlLayout,
  serializable
} from '@ng-dynamic-forms/core';
import { DYNAMIC_FORM_CONTROL_TYPE_TAG } from './tag/dynamic-tag.model';

export interface DynamicRowArrayModelConfig extends DynamicFormArrayModelConfig {
  notRepeteable: boolean;
}

export class DynamicRowArrayModel extends DynamicFormArrayModel {
  @serializable() notRepeteable = false;
  isRowArray = true;

  constructor(config: DynamicRowArrayModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.notRepeteable = config.notRepeteable;
  }

}
