import { isNotEmpty, isNotNull, isNotUndefined } from '../../../empty.util';
import { FormFieldModel } from '../models/form-field.model';
import { IntegrationSearchOptions } from '../../../../core/integration/models/integration-options.model';

import { uniqueId } from 'lodash';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import {
  DynamicRowArrayModel,
  DynamicRowArrayModelConfig
} from '../ds-dynamic-form-ui/models/ds-dynamic-row-array-model';
import { DsDynamicInputModel, DsDynamicInputModelConfig } from '../ds-dynamic-form-ui/models/ds-dynamic-input.model';
import { AuthorityModel } from '../../../../core/integration/models/authority.model';
import { FormFieldLanguageValueObject } from '../models/form-field-language-value.model';
import { DynamicFormControlLayout } from '@ng-dynamic-forms/core';
import { setLayout } from './parser.utils';

export abstract class FieldParser {

  protected fieldId: string;

  constructor(protected configData: FormFieldModel, protected initFormValues) {
  }

  public abstract modelFactory(fieldValue?: FormFieldMetadataValueObject): any;

  public parse() {
    if (((this.getInitValueCount() > 1 && !this.configData.repeatable) || (this.configData.repeatable))
      && (this.configData.input.type !== 'list')
      && (this.configData.input.type !== 'tag')
      && (this.configData.input.type !== 'group')
    ) {
      let arrayCounter = 0;
      let fieldArrayCounter = 0;

      const config = {
        id: uniqueId() + '_array',
        initialCount: this.getInitArrayIndex(),
        notRepeteable: !this.configData.repeatable,
        groupFactory: () => {
          let model;
          if ((arrayCounter === 0)) {
            model = this.modelFactory();
            arrayCounter++;
          } else {
            const fieldArrayOfValueLenght = this.getInitValueCount(arrayCounter - 1);
            let fieldValue = null;
            if (fieldArrayOfValueLenght > 0) {
              fieldValue = this.getInitFieldValue(arrayCounter - 1, fieldArrayCounter++);
              if (fieldArrayCounter === fieldArrayOfValueLenght) {
                fieldArrayCounter = 0;
                arrayCounter++;
              }
            }
            model = this.modelFactory(fieldValue);
          }
          setLayout(model, 'element', 'host', 'col');
          if (model.hasLanguages) {
            setLayout(model, 'grid', 'control', 'col');
          }
          return [model];
        }
      } as DynamicRowArrayModelConfig;

      const layout: DynamicFormControlLayout = {
        grid: {
          group: 'dsgridgroup form-row'
        }
      };

      return new DynamicRowArrayModel(config, layout);

    } else {
      const model = this.modelFactory(this.getInitFieldValue());
      if (model.hasLanguages) {
        setLayout(model, 'grid', 'control', 'col');
      }
      return model;
    }
  }

  protected getInitValueCount(index = 0, fieldId?): number {
    const fieldIds = fieldId || this.getFieldId();
    if (isNotEmpty(this.initFormValues) && isNotNull(fieldIds) && fieldIds.length === 1 && this.initFormValues.hasOwnProperty(fieldIds[0])) {
      return this.initFormValues[fieldIds[0]].length;
    } else if (isNotEmpty(this.initFormValues) && isNotNull(fieldIds) && fieldIds.length > 1) {
      const values = [];
      fieldIds.forEach((id) => {
        if (this.initFormValues.hasOwnProperty(id)) {
          values.push(this.initFormValues[id].length);
        }
      });
      return values[index];
    } else {
      return 0;
    }
  }

  protected getInitGroupValues(): FormFieldMetadataValueObject[] {
    const fieldIds = this.getFieldId();
    if (isNotEmpty(this.initFormValues) && isNotNull(fieldIds) && fieldIds.length === 1 && this.initFormValues.hasOwnProperty(fieldIds[0])) {
      return this.initFormValues[fieldIds[0]];
    }
  }

  protected getInitFieldValues(fieldId): FormFieldMetadataValueObject[] {
    if (isNotEmpty(this.initFormValues) && isNotNull(fieldId) && this.initFormValues.hasOwnProperty(fieldId)) {
      return this.initFormValues[fieldId];
    }
  }

  protected getInitFieldValue(outerIndex = 0, innerIndex = 0, fieldId?): FormFieldMetadataValueObject {
    const fieldIds = fieldId || this.getFieldId();
    if (isNotEmpty(this.initFormValues)
      && isNotNull(fieldIds)
      && fieldIds.length === 1
      && this.initFormValues.hasOwnProperty(fieldIds[outerIndex])
      && this.initFormValues[fieldIds[outerIndex]].length > innerIndex) {
      return this.initFormValues[fieldIds[outerIndex]][innerIndex];
    } else if (isNotEmpty(this.initFormValues) && isNotNull(fieldIds) && fieldIds.length > 1) {
      const values: FormFieldMetadataValueObject[] = [];
      fieldIds.forEach((id) => {
        if (this.initFormValues.hasOwnProperty(id)) {
          const valueObj: FormFieldMetadataValueObject = Object.create({});
          valueObj.metadata = id;
          valueObj.value = this.initFormValues[id][innerIndex];
          values.push(valueObj);
        }
      });
      return values[outerIndex];
    } else {
      return null;
    }
  }

  protected getInitArrayIndex() {
    const fieldIds: any = this.getFieldId();
    if (isNotEmpty(this.initFormValues) && isNotNull(fieldIds) && fieldIds.length === 1 && this.initFormValues.hasOwnProperty(fieldIds)) {
      return this.initFormValues[fieldIds].length;
    } else if (isNotEmpty(this.initFormValues) && isNotNull(fieldIds) && fieldIds.length > 1) {
      let counter = 0;
      fieldIds.forEach((id) => {
        if (this.initFormValues.hasOwnProperty(id)) {
          counter = counter + this.initFormValues[id].length;
        }
      });
      return (counter === 0) ? 1 : counter;
    } else {
      return 1;
    }
  }

  protected getFieldId(): string[] {
    if (Array.isArray(this.configData.selectableMetadata)) {
      if (this.configData.selectableMetadata.length === 1) {
        return [this.configData.selectableMetadata[0].metadata];
      } else {
        const ids = [];
        this.configData.selectableMetadata.forEach((entry) => ids.push(entry.metadata));
        return ids;
      }
    } else {
      return null;
    }
  }

  protected initModel(id?: string, label = true, labelEmpty = false, setErrors = true) {

    const controlModel = Object.create(null);

    // Sets input ID
    this.fieldId = id ? id : this.getFieldId()[0];

    // Sets input name (with the original field's id value)
    controlModel.name = this.fieldId;

    // input ID doesn't allow dots, so replace them
    controlModel.id = (this.fieldId).replace(/\./g, '_');

    if (label) {
      controlModel.label = (labelEmpty) ? '&nbsp;' : this.configData.label;
    }

    controlModel.placeholder = this.configData.label;

    if (this.configData.mandatory && setErrors) {
      this.setErrors(controlModel);
    }

    // Available Languages
    if (this.configData.languageCodes && this.configData.languageCodes.length > 0) {
      (controlModel as DsDynamicInputModel).languageCodes = this.configData.languageCodes;
    }

    return controlModel;
  }

  protected setErrors(controlModel) {
    controlModel.required = true;
    controlModel.validators = Object.assign({}, controlModel.validators, {required: null});
    controlModel.errorMessages = Object.assign(
      {},
      controlModel.errorMessages,
      {required: this.configData.mandatoryMessage});
  }

  protected setOptions(controlModel) {
    // Checks if field has multiple values and sets options available
    if (isNotUndefined(this.configData.selectableMetadata) && this.configData.selectableMetadata.length > 1) {
      controlModel.options = [];
      this.configData.selectableMetadata.forEach((option, key) => {
        if (key === 0) {
          controlModel.value = option.metadata;
        }
        controlModel.options.push({label: option.label, value: option.metadata});
      });
    }
  }

  public getAuthorityOptionsObj(uuid, name, metadata): IntegrationSearchOptions {
    const authorityOptions: IntegrationSearchOptions = new IntegrationSearchOptions(uuid);

    authorityOptions.name = name;
    authorityOptions.metadata = metadata;

    return authorityOptions;
  }

  public setValues(modelConfig: DsDynamicInputModelConfig, fieldValue: any, forceAuthority: boolean = false, groupModel?: boolean) {
    if (isNotEmpty(fieldValue)) {
      if (groupModel) {
        // Array, values is an array
        modelConfig.value = this.getInitGroupValues();
        if (Array.isArray(modelConfig.value) && modelConfig.value.length > 0 && modelConfig.value[0].language) {
          // Array Item has language, ex. AuthorityModel
          modelConfig.language = modelConfig.value[0].language;
        }
        return;
      }

      if (fieldValue instanceof FormFieldMetadataValueObject) {
        // Case string with language
        modelConfig.value = fieldValue;
        modelConfig.language = fieldValue.language;
      }
      if (fieldValue instanceof FormFieldLanguageValueObject) {
        // Case string with language
        modelConfig.value = fieldValue.value;
        modelConfig.language = fieldValue.language;

      } else if (fieldValue instanceof AuthorityModel) {
        // AuthorityModel
        modelConfig.value = fieldValue;

      } else {
        if (forceAuthority) {
          // If value isn't an instance of AuthorityModel instantiate it
          const authorityValue: AuthorityModel = new AuthorityModel();
          authorityValue.value = fieldValue;
          authorityValue.display = fieldValue;
          modelConfig.value = authorityValue;
        } else {
          if (typeof fieldValue === 'string') {
            // Case only string
            modelConfig.value = fieldValue;
          } else if (fieldValue.value) {
            // Case ComboBox, >=1 retry, first time fieldValue is null
            modelConfig.value = fieldValue.value;
          }
        }
      }
    }

    return modelConfig;
  }

}
