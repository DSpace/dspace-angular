import { hasValue, isNotEmpty, isNotNull, isNotUndefined } from '../../../empty.util';
import { FormFieldModel } from '../models/form-field.model';

import { uniqueId } from 'lodash';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import {
  DynamicRowArrayModel,
  DynamicRowArrayModelConfig
} from '../ds-dynamic-form-ui/models/ds-dynamic-row-array-model';
import { DsDynamicInputModel, DsDynamicInputModelConfig } from '../ds-dynamic-form-ui/models/ds-dynamic-input.model';
import { DynamicFormControlLayout } from '@ng-dynamic-forms/core';
import { setLayout } from './parser.utils';
import { AuthorityOptions } from '../../../../core/integration/models/authority-options.model';
import { ParserOptions } from './parser-options';

export abstract class FieldParser {

  protected fieldId: string;

  constructor(protected configData: FormFieldModel, protected initFormValues, protected parserOptions: ParserOptions) {
  }

  public abstract modelFactory(fieldValue?: FormFieldMetadataValueObject, label?: boolean): any;

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
        label: this.configData.label,
        initialCount: this.getInitArrayIndex(),
        notRepeatable: !this.configData.repeatable,
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
            model = this.modelFactory(fieldValue, false);
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
          group: 'form-row'
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
    const fieldIds = fieldId || this.getAllFieldIds();
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
    const fieldIds = this.getAllFieldIds();
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
    const fieldIds = fieldId || this.getAllFieldIds();
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
          const valueObj: FormFieldMetadataValueObject = Object.assign(new FormFieldMetadataValueObject(), this.initFormValues[id][innerIndex]);
          valueObj.metadata = id;
          // valueObj.value = this.initFormValues[id][innerIndex];
          values.push(valueObj);
        }
      });
      return values[outerIndex];
    } else {
      return null;
    }
  }

  protected getInitArrayIndex() {
    const fieldIds: any = this.getAllFieldIds();
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

  protected getFieldId(): string {
    const ids = this.getAllFieldIds();
    return isNotNull(ids) ? ids[0] : null;
  }

  protected getAllFieldIds(): string[] {
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
    this.fieldId = id ? id : this.getFieldId();

    // Sets input name (with the original field's id value)
    controlModel.name = this.fieldId;

    // input ID doesn't allow dots, so replace them
    controlModel.id = (this.fieldId).replace(/\./g, '_');

    // Set read only option
    controlModel.readOnly = this.parserOptions.readOnly;
    controlModel.disabled = this.parserOptions.readOnly;

    // Set label
    this.setLabel(controlModel, label, labelEmpty);

    controlModel.placeholder = this.configData.label;

    if (this.configData.mandatory && setErrors) {
      this.markAsRequired(controlModel);
    }

    if (this.hasRegex()) {
      this.addPatternValidator(controlModel);
    }

    // Available Languages
    if (this.configData.languageCodes && this.configData.languageCodes.length > 0) {
      (controlModel as DsDynamicInputModel).languageCodes = this.configData.languageCodes;
    }
/*    (controlModel as DsDynamicInputModel).languageCodes = [{
        display: 'English',
        code: 'en_US'
      },
      {
        display: 'Italian',
        code: 'it_IT'
      }];*/

    return controlModel;
  }

  protected hasRegex() {
    return hasValue(this.configData.input.regex);
  }

  protected addPatternValidator(controlModel) {
    const regex = new RegExp(this.configData.input.regex);
    controlModel.validators = Object.assign({}, controlModel.validators, {pattern: regex});
    controlModel.errorMessages = Object.assign(
      {},
      controlModel.errorMessages,
      {pattern: 'error.validation.pattern'});

  }

  protected markAsRequired(controlModel) {
    controlModel.required = true;
    controlModel.validators = Object.assign({}, controlModel.validators, {required: null});
    controlModel.errorMessages = Object.assign(
      {},
      controlModel.errorMessages,
      {required: this.configData.mandatoryMessage});
  }

  protected setLabel(controlModel, label = true, labelEmpty = false) {
    if (label) {
      controlModel.label = (labelEmpty) ? '&nbsp;' : this.configData.label;
    }
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

  public setAuthorityOptions(controlModel, authorityUuid) {
    if (isNotEmpty(this.configData.selectableMetadata[0].authority)) {
      controlModel.authorityOptions = new AuthorityOptions(
        this.configData.selectableMetadata[0].authority,
        this.configData.selectableMetadata[0].metadata,
        authorityUuid,
        this.configData.selectableMetadata[0].closed
      )
    }
  }

  public setValues(modelConfig: DsDynamicInputModelConfig, fieldValue: any, forceValueAsObj: boolean = false, groupModel?: boolean) {
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

      if (typeof fieldValue === 'object') {
        modelConfig.language = fieldValue.language;
        if (forceValueAsObj) {
          modelConfig.value = fieldValue;
        } else {
          modelConfig.value = fieldValue.value;
        }
      } else {
        if (forceValueAsObj) {
          // If value isn't an instance of FormFieldMetadataValueObject instantiate it
          modelConfig.value = new FormFieldMetadataValueObject(fieldValue);
        } else {
          if (typeof fieldValue === 'string') {
            // Case only string
            modelConfig.value = fieldValue;
          }
        }
      }
    }

    return modelConfig;
  }

}
