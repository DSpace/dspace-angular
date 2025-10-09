import { getMockTranslateService } from 'src/app/shared/mocks/translate.service.mock';

import { DynamicLookupNameModel } from '../ds-dynamic-form-ui/models/lookup/dynamic-lookup-name.model';
import { FormFieldModel } from '../models/form-field.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { LookupNameFieldParser } from './lookup-name-field-parser';
import { ParserOptions } from './parser-options';

describe('LookupNameFieldParser test suite', () => {
  let field: FormFieldModel;
  let initFormValues = {};
  let translateService = getMockTranslateService();

  const submissionId = '1234';
  const parserOptions: ParserOptions = {
    readOnly: false,
    submissionScope: 'testScopeUUID',
    collectionUUID: null,
    typeField: 'dc_type',
  };

  beforeEach(() => {
    field = {
      input: {
        type: 'lookup-name',
      },
      label: 'Author',
      mandatory: 'false',
      repeatable: false,
      hints: 'Enter the name of the author.',
      selectableMetadata: [
        {
          metadata: 'author',
          controlledVocabulary: 'RPAuthority',
          closed: false,
        },
      ],
      languageCodes: [],
    } as FormFieldModel;

  });

  it('should init parser properly', () => {
    const parser = new LookupNameFieldParser(submissionId, field, initFormValues, parserOptions, translateService);

    expect(parser instanceof LookupNameFieldParser).toBe(true);
  });

  it('should return a DynamicLookupNameModel object when repeatable option is false', () => {
    const parser = new LookupNameFieldParser(submissionId, field, initFormValues, parserOptions, translateService);

    const fieldModel = parser.parse();

    expect(fieldModel instanceof DynamicLookupNameModel).toBe(true);
  });

  it('should set init value properly', () => {
    initFormValues = {
      author: [new FormFieldMetadataValueObject('test author')],
    };
    const expectedValue = new FormFieldMetadataValueObject('test author');

    const parser = new LookupNameFieldParser(submissionId, field, initFormValues, parserOptions, translateService);

    const fieldModel = parser.parse();

    expect(fieldModel.value).toEqual(expectedValue);
  });

});
