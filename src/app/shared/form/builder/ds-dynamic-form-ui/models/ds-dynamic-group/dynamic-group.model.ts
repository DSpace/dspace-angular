import {
  ClsConfig, DynamicFormGroupModel, DynamicFormGroupModelConfig,
  DynamicInputModel,
  DynamicInputModelConfig,
  serializable
} from '@ng-dynamic-forms/core';
import {
  FormRowModel
} from '../../../../../../core/shared/config/config-submission-forms.model';
import {Chips} from '../../../../../chips/chips.model';
import {isNotEmpty} from '../../../../../empty.util';

export const DYNAMIC_FORM_CONTROL_TYPE_DYNAMIC_GROUP = 'DYNAMIC_GROUP';

/**
 * Dynamic Group Model configuration interface
 */
export interface DynamicGroupModelConfig extends DynamicFormGroupModelConfig {
  id: string,
  label: string,
  name: string,
  placeholder: string,
  formConfiguration: FormRowModel[],

  chips: Chips;
  storedValue: any[];
}

/**
 * Dynamic Group Model class
 */
export class DynamicGroupModel extends DynamicFormGroupModel {

  @serializable() id: string;
  @serializable() label: string;
  @serializable() name: string;
  @serializable() placeholder: string;
  @serializable() formConfiguration: FormRowModel[];
  // @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_DYNAMIC_GROUP;

  @serializable() chips: Chips;
  @serializable() storedValue: any[];

  constructor(config: DynamicGroupModelConfig, cls?: ClsConfig) {
    super(config, cls);

    this.id = config.id;
    this.label = config.label;
    this.name = config.name;
    this.placeholder = config.placeholder;
    this.formConfiguration = config.formConfiguration;

    this.chips = config.chips || new Chips();
    this.storedValue = config.storedValue;
  }

  // get value(): any[] {
  //   return this.chips.getItems();
  // }
}
