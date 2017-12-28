import {
  ClsConfig,
  DynamicInputModel,
  DynamicInputModelConfig,
  serializable
} from '@ng-dynamic-forms/core';


export const DYNAMIC_FORM_CONTROL_TYPE_DYNAMIC_GROUP = 'DYNAMIC_GROUP';

/**
 * Dynamic Group Model configuration interface
 */
export interface DynamicGroupModelConfig extends DynamicInputModelConfig {
  id: string,
  label: string,
  name: string,
  placeholder: string,
}

/**
 * Dynamic Grupl Model class
 */
export class DynamicGroupModel extends DynamicInputModel {

  @serializable() id: string;
  @serializable() label: string;
  @serializable() name: string;
  @serializable() placeholder: string;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_DYNAMIC_GROUP;


  constructor(config: DynamicGroupModelConfig, cls?: ClsConfig) {
    super(config, cls);

    this.id = config.id;
    this.label = config.label;
    this.name = config.name;
    this.placeholder = config.placeholder;
  }
}
