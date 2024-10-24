import { DynamicDatePickerModel } from '@ng-dynamic-forms/core';

import { FormFieldModel } from '../models/form-field.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { ParserOptions } from './parser-options';
import { CalendarFieldParser } from './calendar-field-parser';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { getMockTranslateService } from '../../../mocks/translate.service.mock';

describe('CalendarFieldParser test suite', () => {
  let field: FormFieldModel;
  let initFormValues: any = {};
  let translateService = getMockTranslateService();

  const submissionId = '1234';
  const parserOptions: ParserOptions = {
    readOnly: false,
    submissionScope: null,
    collectionUUID: null,
    typeField: 'type',
    isInnerForm: false
  };

  beforeEach(() => {
    field = {
      input: {
        type: 'calendar'
      },
      label: 'Date of Issue.',
      mandatory: 'true',
      repeatable: false,
      hints: 'Please give the date of previous publication or public distribution. You can leave out the day and/or month if they aren\'t applicable.',
      mandatoryMessage: 'You must enter at least the year.',
      selectableMetadata: [
        {
          metadata: 'date',
        }
      ],
      languageCodes: []
    } as FormFieldModel;

  });

  it('should init parser properly', () => {
    const parser = new CalendarFieldParser(submissionId, field, initFormValues, parserOptions, null, translateService);

    expect(parser instanceof CalendarFieldParser).toBe(true);
  });

  it('should return a DynamicDatePickerModel object when repeatable option is false', () => {
    const parser = new CalendarFieldParser(submissionId, field, initFormValues, parserOptions, null, translateService);

    const fieldModel = parser.parse();

    expect(fieldModel instanceof DynamicDatePickerModel).toBe(true);
  });

  it('should set init value properly', () => {
    initFormValues = {
      date: [new FormFieldMetadataValueObject('1983-11-18')],
    };
    const expectedValue = new NgbDate(1983, 11, 18);

    const parser = new CalendarFieldParser(submissionId, field, initFormValues, parserOptions, null, translateService);

    const fieldModel = parser.parse();

    expect(fieldModel.value).toEqual(expectedValue);
  });
});
