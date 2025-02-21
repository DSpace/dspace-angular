import { getMockTranslateService } from '../../../../core/mocks/translate.service.mock';
import { FormFieldModel } from '../../../../core/shared/form/form-field.model';
import { DynamicTagModel } from '../ds-dynamic-form-ui/models/tag/dynamic-tag.model';
import { FormFieldMetadataValueObject } from '../../../../core/config/models/form-field-metadata-value.model';
import { ParserOptions } from './parser-options';
import { TagFieldParser } from './tag-field-parser';

describe('TagFieldParser test suite', () => {
  let field: FormFieldModel;
  let initFormValues: any = {};
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
        type: 'tag',
      },
      label: 'Keywords',
      mandatory: 'false',
      repeatable: false,
      hints: 'Local controlled vocabulary.',
      selectableMetadata: [
        {
          metadata: 'subject',
          controlledVocabulary: 'JOURNALAuthority',
          closed: false,
        },
      ],
      languageCodes: [],
    } as FormFieldModel;

  });

  it('should init parser properly', () => {
    const parser = new TagFieldParser(submissionId, field, initFormValues, parserOptions, translateService);

    expect(parser instanceof TagFieldParser).toBe(true);
  });

  it('should return a DynamicTagModel object when repeatable option is false', () => {
    const parser = new TagFieldParser(submissionId, field, initFormValues, parserOptions, translateService);

    const fieldModel = parser.parse();

    expect(fieldModel instanceof DynamicTagModel).toBe(true);
  });

  it('should set init value properly', () => {
    initFormValues = {
      subject: [
        new FormFieldMetadataValueObject('test subject'),
        new FormFieldMetadataValueObject('another test subject'),
      ],
    };

    const parser = new TagFieldParser(submissionId, field, initFormValues, parserOptions, translateService);

    const fieldModel = parser.parse();

    expect(fieldModel.value).toEqual(initFormValues.subject);
  });

});
