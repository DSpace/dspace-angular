import { isNotEmpty, isNotUndefined } from '../../../empty.util';
import { FormFieldModel } from '../models/form-field.model';
import { IntegrationSearchOptions } from '../../../../core/integration/models/integration-options.model';
import { ClsConfig, DynamicFormArrayModel } from '@ng-dynamic-forms/core';

import * as _ from 'lodash';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';

export abstract class FieldParser {

  protected fieldId: string;

  constructor(protected configData: FormFieldModel, protected initFormValues) { }

  public abstract modelFactory(fieldValue: FormFieldMetadataValueObject): any;

  public parse() {
    if (this.configData.repeatable && this.configData.input.type !== 'list') {
      let counter = 0;
      const arrayModel = new DynamicFormArrayModel(
        {
          id : _.uniqueId() + '_array',
          initialCount: this.getInitArrayIndex(),
          groupFactory: () => {
            console.log(this.getFieldId(), counter);
            const fieldValue = (counter === 0) ? null : this.getInitFieldValue(counter - 1);
            const model = this.modelFactory(fieldValue);
            model.cls.element.host = model.cls.element.host.concat(' col');
            counter++;
            return [model];
          }
        }, {
          grid: {
            group: 'dsgridgroup form-row'
          }
        }
      );
      console.log('arraymodel', arrayModel);
      return arrayModel;
    } else {
      return this.modelFactory(this.getInitFieldValue());
    }
  }

  protected getInitFieldValue(index = 0): FormFieldMetadataValueObject {
    if (isNotEmpty(this.initFormValues) && this.initFormValues.hasOwnProperty(this.getFieldId())) {
      return this.initFormValues[this.getFieldId()][index];
    } else {
      return null;
    }
  }

  protected getInitArrayIndex() {
    if (isNotEmpty(this.initFormValues) && this.initFormValues.hasOwnProperty(this.getFieldId())) {
      return this.initFormValues[this.getFieldId()].length;
    } else {
      return 1;
    }
  }

  protected getFieldId() {
    return this.configData.selectableMetadata[0].metadata;
  }

  protected initModel(id?: string, label = true, labelEmpty = false) {

    const controlModel = Object.create(null);

    // Sets input ID
    this.fieldId = id ? id : this.getFieldId();

    // Sets input name (with the original field's id value)
    controlModel.name = this.fieldId;

    // input ID doesn't allow dots, so replace them
    controlModel.id = (this.fieldId).replace(/\./g, '_');

    if (label) {
      controlModel.label = (labelEmpty) ? '&nbsp;' : this.configData.label;
    }

    controlModel.placeholder = this.configData.label;

    if (this.configData.mandatory) {
      controlModel.required = true;
      controlModel.validators = Object.assign({}, controlModel.validators, {required: null});
      controlModel.errorMessages = Object.assign(
        {},
        controlModel.errorMessages,
        {required: this.configData.mandatoryMessage});
    }

    return controlModel;
  }

  protected setOptions(controlModel) {
    // Checks if field has multiple values and sets options available
    if (isNotUndefined(this.configData.selectableMetadata) && this.configData.selectableMetadata.length > 1) {
      controlModel.options = [];
      this.configData.selectableMetadata.forEach((option, key) => {
        if (key === 0) {
          controlModel.value = option.metadata
        }
        controlModel.options.push({label: option.label, value: option.metadata})
      });
    }
  }

  public getAuthorityOptionsObj(uuid, name, metadata): IntegrationSearchOptions {
    const authorityOptions: IntegrationSearchOptions = new IntegrationSearchOptions(uuid);

    authorityOptions.name = name;
    authorityOptions.metadata = metadata;

    return authorityOptions;
  }

}
