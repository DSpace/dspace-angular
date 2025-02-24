import {
  FormFieldMetadataValueObject,
  FormFieldModel,
  getMockTranslateService,
} from '@dspace/core';

import { DsDynamicTextAreaModel } from '../ds-dynamic-form-ui/models/ds-dynamic-textarea.model';
import { ParserOptions } from './parser-options';
import { TextareaFieldParser } from './textarea-field-parser';

describe('TextareaFieldParser test suite', () => {
  let field: FormFieldModel;
  let initFormValues: any = {};
  let translateService = getMockTranslateService();

  const submissionId = '1234';
  const parserOptions: ParserOptions = {
    readOnly: false,
    submissionScope: null,
    collectionUUID: null,
    typeField: 'dc_type',
  };

  beforeEach(() => {
    field = {
      input: {
        type: 'textarea',
      },
      label: 'Description',
      mandatory: 'false',
      repeatable: false,
      hints: 'Enter a description.',
      selectableMetadata: [
        {
          metadata: 'description',
        },
      ],
      languageCodes: [],
    } as FormFieldModel;

  });

  it('should init parser properly', () => {
    const parser = new TextareaFieldParser(submissionId, field, initFormValues, parserOptions, translateService);

    expect(parser instanceof TextareaFieldParser).toBe(true);
  });

  it('should return a DsDynamicTextAreaModel object when repeatable option is false', () => {
    const parser = new TextareaFieldParser(submissionId, field, initFormValues, parserOptions, translateService);

    const fieldModel = parser.parse();

    expect(fieldModel instanceof DsDynamicTextAreaModel).toBe(true);
  });

  it('should set init value properly', () => {
    initFormValues = {
      description: [
        new FormFieldMetadataValueObject('test description'),
      ],
    };
    const expectedValue = 'test description';

    const parser = new TextareaFieldParser(submissionId, field, initFormValues, parserOptions, translateService);

    const fieldModel = parser.parse();

    expect(fieldModel.value).toEqual(expectedValue);
  });

});
