import { LookupNameFieldParser } from './lookup-name-field-parser';
import { ParserOptions } from './parser-options';
import { DynamicLookupNameModel } from '../ds-dynamic-form-ui/models/lookup/dynamic-lookup-name.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { FormFieldModel } from '../models/form-field.model';

describe('LookupNameFieldParser test suite', () => {
  let field: FormFieldModel;
  let initFormValues = {};

  const parserOptions: ParserOptions = {
    readOnly: false,
    submissionScope: 'testScopeUUID',
    authorityUuid: null
  };

  beforeEach(() => {
    field = {
      input: {
        type: 'lookup-name'
      },
      label: 'Author',
      mandatory: 'false',
      repeatable: false,
      hints: 'Enter the name of the author.',
      selectableMetadata: [
        {
          metadata: 'author',
          authority: 'RPAuthority',
          closed: false
        }
      ],
      languageCodes: []
    } as FormFieldModel;

  });

  it('should init parser properly', () => {
    const parser = new LookupNameFieldParser(field, initFormValues, parserOptions);

    expect(parser instanceof LookupNameFieldParser).toBe(true);
  });

  it('should return a DynamicLookupNameModel object when repeatable option is false', () => {
    const parser = new LookupNameFieldParser(field, initFormValues, parserOptions);

    const fieldModel = parser.parse();

    expect(fieldModel instanceof DynamicLookupNameModel).toBe(true);
  });

  it('should set init value properly', () => {
    initFormValues = {
      author: [new FormFieldMetadataValueObject('test author')],
    };
    const expectedValue = new FormFieldMetadataValueObject('test author');

    const parser = new LookupNameFieldParser(field, initFormValues, parserOptions);

    const fieldModel = parser.parse();

    expect(fieldModel.value).toEqual(expectedValue);
  });

});
