import { isNotUndefined } from '../../../empty.util';
import { FormFieldModel } from '../models/form-field.model';
import { AuthorityOptions } from '../models/authority-options.model';
import { ClsConfig, DynamicFormArrayModel } from '@ng-dynamic-forms/core';

import * as _ from 'lodash';

export abstract class FieldParser {

  constructor(protected configData: FormFieldModel) { }

  public abstract modelFactory(): any;

  public parse() {
    if (this.configData.repeatable) {
      return new DynamicFormArrayModel(
        {
          id : _.uniqueId() + '_array',
          initialCount: 1,
          groupFactory: () => {
            const model = this.modelFactory();
            model.cls.element.host = model.cls.element.host.concat(' col');
            return [model];
          }
        }, {
          grid: {
            group: 'dsgridgroup form-row'
          }
        }
      );
    } else {
      return this.modelFactory()
    }
  }

  protected initModel(id?: string, label = true, labelEmpty = false) {

    const controlModel = Object.create(null);

    // Sets input ID and name
    const inputId = id ? id : this.configData.selectableMetadata[0].metadata;
    controlModel.id = (inputId).replace(/\./g, '_');
    controlModel.name = inputId;

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
    if (this.configData.value) {
      controlModel.value = this.configData.value;
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

  public getAuthorityOptionsObj(uuid, name, metadata): AuthorityOptions {
    const authorityOptions: AuthorityOptions = new AuthorityOptions(uuid);

    authorityOptions.name = name;
    authorityOptions.metadata = metadata;

    return authorityOptions;
  }

}
