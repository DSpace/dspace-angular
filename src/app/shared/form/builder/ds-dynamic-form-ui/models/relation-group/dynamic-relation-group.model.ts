import { DynamicFormControlLayout, serializable } from '@ng-dynamic-forms/core';
import { FormRowModel } from '../../../../../../core/config/models/config-submission-forms.model';
import { DsDynamicInputModel, DsDynamicInputModelConfig } from '../ds-dynamic-input.model';
import { isEmpty, isNull } from '../../../../../empty.util';

export const DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP = 'RELATION';
export const PLACEHOLDER_PARENT_METADATA = '#PLACEHOLDER_PARENT_METADATA_VALUE#';

/**
 * Dynamic Group Model configuration interface
 */
export interface DynamicRelationGroupModelConfig extends DsDynamicInputModelConfig {
  formConfiguration: FormRowModel[],
  mandatoryField: string,
  relationFields: string[],
  scopeUUID: string,
  submissionScope: string;
}

/**
 * Dynamic Group Model class
 */
export class DynamicRelationGroupModel extends DsDynamicInputModel {
  @serializable() formConfiguration: FormRowModel[];
  @serializable() mandatoryField: string;
  @serializable() relationFields: string[];
  @serializable() scopeUUID: string;
  @serializable() submissionScope: string;
  @serializable() _value: any[];
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP;

  constructor(config: DynamicRelationGroupModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);

    this.formConfiguration = config.formConfiguration;
    this.mandatoryField = config.mandatoryField;
    this.relationFields = config.relationFields;
    this.scopeUUID = config.scopeUUID;
    this.submissionScope = config.submissionScope;
    const value = config.value || [];
    this.valueUpdates.next(value);
  }

  get value() {
    return this._value
  }

  set value(value) {
    this._value = (isEmpty(value)) ? null : value;
  }

  isEmpty() {
    const value = this.getGroupValue();
    return (value.length === 1 && isNull(value[0][this.mandatoryField]));
  }

  getGroupValue(): any[] {
    if (isEmpty(this._value)) {
      // If items is empty, last element has been removed
      // so emit an empty value that allows to dispatch
      // a remove JSON PATCH operation
      const emptyItem = Object.create({});
      emptyItem[this.mandatoryField] = null;
      this.relationFields
        .forEach((field) => {
          emptyItem[field] = null;
        });
      return [emptyItem];
    }
    return this._value
  }
}
