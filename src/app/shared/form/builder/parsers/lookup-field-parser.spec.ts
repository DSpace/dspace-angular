import { FormFieldModel } from '../models/form-field.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { LookupFieldParser } from './lookup-field-parser';
import { DynamicLookupModel } from '../ds-dynamic-form-ui/models/lookup/dynamic-lookup.model';
import { ParserOptions } from './parser-options';
import { getMockTranslateService } from 'src/app/shared/mocks/translate.service.mock';

describe('LookupFieldParser test suite', () => {
  let field: FormFieldModel;
  let initFormValues = {};
  let translateService = getMockTranslateService();

  const submissionId = '1234';
  const parserOptions: ParserOptions = {
    readOnly: false,
    submissionScope: 'testScopeUUID',
    collectionUUID: null,
    typeField: 'dc_type',
    isInnerForm: false
  };

  beforeEach(() => {
    field = {
      input: {
        type: 'lookup'
      },
      label: 'Journal',
      mandatory: 'false',
      repeatable: false,
      hints: 'Enter the name of the journal where the item has been published, if any.',
      selectableMetadata: [
        {
          metadata: 'journal',
          controlledVocabulary: 'JOURNALAuthority',
          closed: false
        }
      ],
      languageCodes: []
    } as FormFieldModel;

  });

  it('should init parser properly', () => {
    const parser = new LookupFieldParser(submissionId, field, initFormValues, parserOptions, null, translateService);

    expect(parser instanceof LookupFieldParser).toBe(true);
  });

  it('should return a DynamicLookupModel object when repeatable option is false', () => {
    const parser = new LookupFieldParser(submissionId, field, initFormValues, parserOptions, null, translateService);

    const fieldModel = parser.parse();

    expect(fieldModel instanceof DynamicLookupModel).toBe(true);
  });

  it('should set init value properly', () => {
    initFormValues = {
      journal: [new FormFieldMetadataValueObject('test journal')],
    };
    const expectedValue = new FormFieldMetadataValueObject('test journal');

    const parser = new LookupFieldParser(submissionId, field, initFormValues, parserOptions, null, translateService);

    const fieldModel = parser.parse();

    expect(fieldModel.value).toEqual(expectedValue);
  });

});
