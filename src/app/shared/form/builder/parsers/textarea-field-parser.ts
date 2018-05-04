import { FieldParser } from './field-parser';
import {
  DynamicFormControlLayout, DynamicTextAreaModel, DynamicTextAreaModelConfig
} from '@ng-dynamic-forms/core';
import { FormFieldModel } from '../models/form-field.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { isNotEmpty } from '../../../empty.util';
import {
  DsDynamicTextAreaModel,
  DsDynamicTextAreaModelConfig
} from '../ds-dynamic-form-ui/models/ds-dynamic-textarea.model';

export class TextareaFieldParser extends FieldParser {

  public modelFactory(fieldValue: FormFieldMetadataValueObject | any): any {
    const textAreaModelConfig: DsDynamicTextAreaModelConfig = this.initModel();

    let layout: DynamicFormControlLayout;

    layout = {
      element: {
        label: 'col-form-label'
      }
    };

    textAreaModelConfig.rows = 10;
    this.setValues(textAreaModelConfig, fieldValue);
    const textAreaModel = new DsDynamicTextAreaModel(textAreaModelConfig, layout);

    return textAreaModel;
  }
}
