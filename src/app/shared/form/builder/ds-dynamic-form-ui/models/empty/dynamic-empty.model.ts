import { DynamicFormControlLayout, serializable } from '@ng-dynamic-forms/core';
import { DsDynamicInputModel, DsDynamicInputModelConfig } from '../ds-dynamic-input.model';

export const DYNAMIC_FORM_CONTROL_TYPE_EMPTY = 'EMPTY';

export interface DsDynamicEmptyModelConfig extends DsDynamicInputModelConfig {
  value?: any;
  repeatable: boolean;
}

export class DynamicEmptyModel extends DsDynamicInputModel {

  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_EMPTY;
  @serializable() value: any;
  @serializable() repeatable: boolean;

  constructor(config: DsDynamicEmptyModelConfig, layout?: DynamicFormControlLayout) {

    super(config, layout);

    this.readOnly = true;
    this.disabled = true;
    this.repeatable = config.repeatable;
    this.valueUpdates.next(config.value);
  }
}
