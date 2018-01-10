import { ClsConfig, DynamicInputModel, DynamicInputModelConfig, serializable } from '@ng-dynamic-forms/core';
import { FormRowModel } from '../../../../../../core/shared/config/config-submission-forms.model';
import { Chips } from '../../../../../chips/chips.model';

export const DYNAMIC_FORM_CONTROL_TYPE_RELATION = 'RELATION';

/**
 * Dynamic Group Model configuration interface
 */
export interface DynamicGroupModelConfig extends DynamicInputModelConfig {
  formConfiguration: FormRowModel[],
  mandatoryField: string,
  name: string,
  relationFields: string[],
  storedValue: any[];
}

/**
 * Dynamic Group Model class
 */
export class DynamicGroupModel extends DynamicInputModel {

  @serializable() formConfiguration: FormRowModel[];
  @serializable() mandatoryField: string;
  @serializable() relationFields: string[];
  @serializable() chips: Chips;
  @serializable() storedValue: any[];
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_RELATION;

  constructor(config: DynamicGroupModelConfig, cls?: ClsConfig) {
    super(config, cls);

    this.formConfiguration = config.formConfiguration;
    this.mandatoryField = config.mandatoryField;
    this.relationFields = config.relationFields;
    this.storedValue = config.storedValue;
    this.chips = new Chips(this.storedValue, 'value', this.mandatoryField);
  }
}
