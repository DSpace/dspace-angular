import { FieldParser } from './field-parser';
import { DynamicDatePickerModelConfig } from '@ng-dynamic-forms/core';
import { FormFieldModel } from '../models/form-field.model';
import { DynamicDsDatePickerModel } from '../ds-dynamic-form-ui/models/ds-date-picker/ds-date-picker.model';
import { isNotEmpty } from '../../../empty.util';
import { DS_DATE_PICKER_SEPARATOR } from '../ds-dynamic-form-ui/models/ds-date-picker/ds-date-picker.component';

export class DateFieldParser extends FieldParser {

  public modelFactory(): any {
    const inputDateModelConfig: DynamicDatePickerModelConfig = this.initModel();

    inputDateModelConfig.toggleIcon = 'fa fa-calendar';

    const dateModel = new DynamicDsDatePickerModel(inputDateModelConfig);

    // Init Data and validity check
    if (isNotEmpty(this.getInitFieldValue())) {
      let malformedData = false;
      const value = this.getInitFieldValue().toString();
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

        if (!malformedData) {
          dateModel.valueUpdates.next(this.getInitFieldValue());
        } else {
          // TODO Set error message
          dateModel.malformedDate = true;
          // TODO
          // const errorMessage = 'The stored date is not compliant';
          // dateModel.validators = Object.assign({}, dateModel.validators, {malformedDate: null});
          // dateModel.errorMessages = Object.assign({}, dateModel.errorMessages, {malformedDate: errorMessage});

          // this.formService.addErrorToField(this.group.get(this.model.id), this.model, errorMessage)
        }
      }

    }
    return dateModel;
  }
}
