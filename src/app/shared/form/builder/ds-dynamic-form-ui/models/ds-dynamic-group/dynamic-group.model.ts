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
  mandatoryField: string,
  relationFields: string[],
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
  @serializable() mandatoryField: string;
  @serializable() relationFields: string[];
  @serializable() chips: Chips;
  @serializable() storedValue: any[];

  constructor(config: DynamicGroupModelConfig, cls?: ClsConfig) {
    super(config, cls);

    this.id = config.id;
    this.label = config.label;
    this.name = config.name;
    this.placeholder = config.placeholder;
    this.formConfiguration = config.formConfiguration;
    this.mandatoryField = config.mandatoryField;
    this.relationFields = config.relationFields;
    this.chips = new Chips();
    this.storedValue = config.storedValue;
  }

  get value(): Map<string, any> {
    const metadataValueMap = new Map();
    const items: any[] = this.chips.getItems();

    items.forEach((item) => {
      Object.keys(item)
        .forEach((key) => {
          const metadataValueList = metadataValueMap.get(key) ? metadataValueMap.get(key) : [];
          metadataValueList.push(item[key]);
          metadataValueMap.set(key, metadataValueList);
        })

    });
    console.log(metadataValueMap);
    return metadataValueMap;
  }
}
