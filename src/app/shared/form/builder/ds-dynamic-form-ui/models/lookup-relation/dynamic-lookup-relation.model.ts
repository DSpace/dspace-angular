import { DynamicFormControlLayout, serializable } from '@ng-dynamic-forms/core';
import { DsDynamicInputModel, DsDynamicInputModelConfig } from '../ds-dynamic-input.model';

export const DYNAMIC_FORM_CONTROL_TYPE_LOOKUP_RELATION = 'LOOKUP_RELATION';

export interface DynamicLookupRelationModelConfig extends DsDynamicInputModelConfig {
  value?: any;
}

export class DynamicLookupRelationModel extends DsDynamicInputModel {

  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_LOOKUP_RELATION;
  @serializable() value: any;

  constructor(config: DynamicLookupRelationModelConfig, layout?: DynamicFormControlLayout) {

    super(config, layout);

    this.readOnly = true;
    this.disabled = true;
    this.valueUpdates.next(config.value);
  }
}
