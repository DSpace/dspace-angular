import { FieldParser } from './field-parser';
import { DynamicDatePickerModelConfig } from '@ng-dynamic-forms/core';
import { FormFieldModel } from '../models/form-field.model';
import { DynamicDsDatePickerModel } from '../ds-dynamic-form-ui/models/date-picker/date-picker.model';
import { isNotEmpty } from '../../../empty.util';
import { DS_DATE_PICKER_SEPARATOR } from '../ds-dynamic-form-ui/models/date-picker/date-picker.component';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';

export class DateFieldParser extends FieldParser {

  public modelFactory(fieldValue: FormFieldMetadataValueObject): any {
    const inputDateModelConfig: DynamicDatePickerModelConfig = this.initModel();

    inputDateModelConfig.toggleIcon = 'fa fa-calendar';
    this.setValues(inputDateModelConfig as any, fieldValue);
    // Init Data and validity check
    if (isNotEmpty(inputDateModelConfig.value)) {
      let malformedData = false;
      const value = inputDateModelConfig.value.toString();
      if (value.length >= 4) {
        const valuesArray = value.split(DS_DATE_PICKER_SEPARATOR);
        if (valuesArray.length < 4) {
          for (let i = 0; i < valuesArray.length; i++) {
            const len = i === 0 ? 4 : 2;
            if (valuesArray[i].length !== len) {
              malformedData = true;
            }
          }
        }

        if (malformedData) {
          // TODO Set error message
          // const errorMessage = 'The stored date is not compliant';
          // dateModel.validators = Object.assign({}, dateModel.validators, {malformedDate: null});
          // dateModel.errorMessages = Object.assign({}, dateModel.errorMessages, {malformedDate: errorMessage});

          // this.formService.addErrorToField(this.group.get(this.model.id), this.model, errorMessage)
        }
      }

    }
    const dateModel = new DynamicDsDatePickerModel(inputDateModelConfig);
    return dateModel;
  }
}
