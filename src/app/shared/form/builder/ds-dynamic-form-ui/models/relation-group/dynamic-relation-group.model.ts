import { DynamicFormControlLayout, serializable } from '@ng-dynamic-forms/core';
import { DsDynamicInputModel, DsDynamicInputModelConfig } from '../ds-dynamic-input.model';
import { hasValue, isEmpty, isNull } from '../../../../../empty.util';
import { FormRowModel } from '../../../../../../core/config/models/config-submission-form.model';
import { DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP } from '../../ds-dynamic-form-constants';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
import { VocabularyEntry } from '../../../../../../core/submission/vocabularies/models/vocabulary-entry.model';

/**
 * Dynamic Group Model configuration interface
 */
export interface DynamicRelationGroupModelConfig extends DsDynamicInputModelConfig {
  submissionId: string;
  formConfiguration: FormRowModel[];
  isInlineGroup: boolean;
  mandatoryField: string;
  relationFields: string[];
  scopeUUID: string;
  submissionScope: string;
}

/**
 * Dynamic Group Model class
 */
export class DynamicRelationGroupModel extends DsDynamicInputModel {
  @serializable() submissionId: string;
  @serializable() formConfiguration: FormRowModel[];
  @serializable() isInlineGroup: boolean;
  @serializable() mandatoryField: string;
  @serializable() relationFields: string[];
  @serializable() scopeUUID: string;
  @serializable() submissionScope: string;
  @serializable() securityLevels: any;
  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP;
  // will be shown only for parts of group
  @serializable() toggleSecurityVisibility = false;

  constructor(config: DynamicRelationGroupModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
    this.submissionId = config.submissionId;
    this.formConfiguration = config.formConfiguration;
    this.mandatoryField = config.mandatoryField;
    this.relationFields = config.relationFields;
    this.scopeUUID = config.scopeUUID;
    this.submissionScope = config.submissionScope;
    this.isInlineGroup = config.isInlineGroup;
    this.value = config.value || [];
  }

  /*  get value() {
      return (isEmpty(this.value)) ? null : this.value
    }*/

  isEmpty() {
    const value = this.getGroupValue();
    return (value.length === 1 && isNull(value[0][this.mandatoryField]));
  }

  getGroupValue(value?: any): any[] {
    if (isEmpty(this.value) && isEmpty(value)) {
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
    } else if ((this.value instanceof VocabularyEntry || this.value instanceof FormFieldMetadataValueObject) ||
      (hasValue(value) && (value instanceof VocabularyEntry || value instanceof FormFieldMetadataValueObject))) {

      const emptyItem = {};
      emptyItem[this.mandatoryField] = hasValue(value) && (value instanceof VocabularyEntry || value instanceof FormFieldMetadataValueObject) ? value : this.value;
      this.relationFields
        .forEach((field) => {
          emptyItem[field] = hasValue((this.value as any).otherInformation) ? (this.value as any).otherInformation[field] : null;
        });

      return [emptyItem];
    }
    return this.value as any[];
  }
}
