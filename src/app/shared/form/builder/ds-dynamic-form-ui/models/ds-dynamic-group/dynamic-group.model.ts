import { ClsConfig, serializable } from '@ng-dynamic-forms/core';
import { FormRowModel } from '../../../../../../core/shared/config/config-submission-forms.model';
import { DsDynamicInputModel, DsDynamicInputModelConfig } from '../ds-dynamic-input.model';

export const DYNAMIC_FORM_CONTROL_TYPE_RELATION = 'RELATION';

/**
 * Dynamic Group Model configuration interface
 */
export interface DynamicGroupModelConfig extends DsDynamicInputModelConfig {
  formConfiguration: FormRowModel[],
  mandatoryField: string,
  name: string,
  relationFields: string[],
  scopeUUID: string,
  value?: any;
}

/**
 * Dynamic Group Model class
 */
export class DynamicGroupModel extends DsDynamicInputModel {
  @serializable() formConfiguration: FormRowModel[];
  @serializable() mandatoryField: string;
  @serializable() relationFields: string[];
  @serializable() scopeUUID: string;
  @serializable() value: any[];
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_RELATION;

  constructor(config: DynamicGroupModelConfig, cls?: ClsConfig) {
    super(config, cls);

    this.formConfiguration = config.formConfiguration;
    this.mandatoryField = config.mandatoryField;
    this.relationFields = config.relationFields;
    this.scopeUUID = config.scopeUUID;
    const value = config.value || [];
    this.valueUpdates.next(value)
  }
}
