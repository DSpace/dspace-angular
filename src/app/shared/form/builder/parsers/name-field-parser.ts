import { Inject } from '@angular/core';
import { FormFieldModel } from '@dspace/core/shared/form/models/form-field.model';
import { TranslateService } from '@ngx-translate/core';

import { ConcatFieldParser } from './concat-field-parser';
import {
  CONFIG_DATA,
  INIT_FORM_VALUES,
  PARSER_OPTIONS,
  SUBMISSION_ID,
} from './field-parser';
import { ParserOptions } from './parser-options';

export class NameFieldParser extends ConcatFieldParser {

  constructor(
    @Inject(SUBMISSION_ID) submissionId: string,
    @Inject(CONFIG_DATA) configData: FormFieldModel,
    @Inject(INIT_FORM_VALUES) initFormValues,
    @Inject(PARSER_OPTIONS) parserOptions: ParserOptions,
      translate: TranslateService,
  ) {
    super(submissionId, configData, initFormValues, parserOptions, translate, ',', 'form.last-name', 'form.first-name');
  }
}
