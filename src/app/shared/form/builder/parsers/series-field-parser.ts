import { FormFieldModel } from '../models/form-field.model';
import { ConcatFieldParser } from './concat-field-parser';
import { ParserOptions } from './parser-options';
import { Workspaceitem } from '../../../../core/submission/models/workspaceitem.model';

export class SeriesFieldParser extends ConcatFieldParser {

  constructor(protected configData: FormFieldModel, protected initFormValues, protected parserOptions: ParserOptions, wsi: Workspaceitem) {
    super(configData, initFormValues, parserOptions, ';', wsi);
  }
}
