import { ConcatFieldParser } from './concat-field-parser';
import { ParserOptions } from './parser-options';
import { FormFieldModel } from '../models/form-field.model';

export class NameFieldParser extends ConcatFieldParser {

  constructor(protected configData: FormFieldModel, protected initFormValues, protected parserOptions: ParserOptions) {
    super(configData, initFormValues, parserOptions, ',', 'form.last-name', 'form.first-name');
  }
}
