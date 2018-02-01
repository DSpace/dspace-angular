import { FieldParser } from './field-parser';
import {
  ClsConfig, DynamicTextAreaModel, DynamicTextAreaModelConfig
} from '@ng-dynamic-forms/core';
import { FormFieldModel } from '../models/form-field.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { isNotEmpty } from '../../../empty.util';
import {
  DsDynamicTextAreaModel,
  DsDynamicTextAreaModelConfig
} from '../ds-dynamic-form-ui/models/ds-dynamic-textarea.model';

export class TextareaFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel, protected initFormValues) {
    super(configData, initFormValues);
  }

  public modelFactory(fieldValue: FormFieldMetadataValueObject | any): any {
    const textAreaModelConfig: DsDynamicTextAreaModelConfig = this.initModel();

    let cls: ClsConfig;

    cls = {
      element: {
        label: 'col-form-label'
      }
    };

    this.setValues(textAreaModelConfig, fieldValue);
    const textAreaModel = new DsDynamicTextAreaModel(textAreaModelConfig, cls);
    textAreaModel.name = this.fieldId;
    textAreaModel.rows = 10;
    return textAreaModel;
  }
}
