import { FieldParser } from './field-parser';
import { FormFieldModel } from '../models/form-field.model';

// @TODO to be implemented
export class SeriesFieldParser extends FieldParser {

  constructor(protected configData: FormFieldModel, protected initFormValues) {
    super(configData, initFormValues);
  }

  public modelFactory(): any {
    return null;
  }
}
