import { FormFieldModel } from '../models/form-field.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { TextareaFieldParser } from './textarea-field-parser';
import { DsDynamicTextAreaModel } from '../ds-dynamic-form-ui/models/ds-dynamic-textarea.model';
import { ParserOptions } from './parser-options';
import { getMockTranslateService } from 'src/app/shared/mocks/translate.service.mock';

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
    isInnerForm: false
  };

  beforeEach(() => {
    field = {
      input: {
        type: 'textarea'
      },
      label: 'Description',
      mandatory: 'false',
      repeatable: false,
      hints: 'Enter a description.',
      selectableMetadata: [
        {
          metadata: 'description'
        }
      ],
      languageCodes: []
    } as FormFieldModel;

  });

  it('should init parser properly', () => {
    const parser = new TextareaFieldParser(submissionId, field, initFormValues, parserOptions, null, translateService);

    expect(parser instanceof TextareaFieldParser).toBe(true);
  });

  it('should return a DsDynamicTextAreaModel object when repeatable option is false', () => {
    const parser = new TextareaFieldParser(submissionId, field, initFormValues, parserOptions, null, translateService);

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

    const parser = new TextareaFieldParser(submissionId, field, initFormValues, parserOptions, null, translateService);

    const fieldModel = parser.parse();

    expect(fieldModel.value).toEqual(expectedValue);
  });

});
