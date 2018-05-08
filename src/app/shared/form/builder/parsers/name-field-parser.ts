import { FormFieldModel } from '../models/form-field.model';

import { ConcatFieldParser } from './concat-field-parser';

export class NameFieldParser extends ConcatFieldParser {

  constructor(protected configData: FormFieldModel, protected initFormValues, protected readOnly: boolean) {
    super(configData, initFormValues, readOnly, ',', 'form.last-name', 'form.first-name');
  }
}
