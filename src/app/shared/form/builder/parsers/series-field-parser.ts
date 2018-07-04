import { FormFieldModel } from '../models/form-field.model';
import { ConcatFieldParser } from './concat-field-parser';
import { ParserOptions } from './parser-options';

export class SeriesFieldParser extends ConcatFieldParser {

  constructor(protected configData: FormFieldModel, protected initFormValues, protected parserOptions: ParserOptions) {
    super(configData, initFormValues, parserOptions, ';');
  }
}
