import { FormFieldModel } from '../models/form-field.model';
import { OneboxFieldParser } from './onebox-field-parser';
import { DynamicQualdropModel } from '../ds-dynamic-form-ui/models/ds-dynamic-qualdrop.model';
import { DynamicOneboxModel } from '../ds-dynamic-form-ui/models/onebox/dynamic-onebox.model';
import { DsDynamicInputModel } from '../ds-dynamic-form-ui/models/ds-dynamic-input.model';
import { ParserOptions } from './parser-options';

describe('OneboxFieldParser test suite', () => {
  let field1: FormFieldModel;
  let field2: FormFieldModel;
  let field3: FormFieldModel;

  const submissionId = '1234';
  const initFormValues = {};
  const parserOptions: ParserOptions = {
    readOnly: false,
    submissionScope: 'testScopeUUID',
    collectionUUID: null,
    typeField: 'dc_type'
  };

  beforeEach(() => {
    field1 = {
      input: { type: 'onebox' },
      label: 'Title',
      mandatory: 'false',
      repeatable: false,
      hints: 'Enter the name of the events, if any.',
      selectableMetadata: [
        {
          metadata: 'title',
          controlledVocabulary: 'EVENTAuthority',
          closed: false
        }
      ],
      languageCodes: []
    } as FormFieldModel;

    field2 = {
      hints: 'If the item has any identification numbers or codes associated with↵	it, please enter the types and the actual numbers or codes.',
      input: { type: 'onebox' },
      label: 'Identifiers',
      languageCodes: [],
      mandatory: 'false',
      repeatable: false,
      selectableMetadata: [
        { metadata: 'dc.identifier.issn', label: 'ISSN' },
        { metadata: 'dc.identifier.other', label: 'Other' },
        { metadata: 'dc.identifier.ismn', label: 'ISMN' },
        { metadata: 'dc.identifier.govdoc', label: 'Gov\'t Doc #' },
        { metadata: 'dc.identifier.uri', label: 'URI' },
        { metadata: 'dc.identifier.isbn', label: 'ISBN' },
        { metadata: 'dc.identifier.doi', label: 'DOI' },
        { metadata: 'dc.identifier.pmid', label: 'PubMed ID' },
        { metadata: 'dc.identifier.arxiv', label: 'arXiv' }
      ]
    } as FormFieldModel;

    field3 = {
      input: { type: 'onebox' },
      label: 'Title',
      mandatory: 'false',
      repeatable: false,
      hints: 'Enter the name of the events, if any.',
      selectableMetadata: [
        {
          metadata: 'title',
        }
      ],
      languageCodes: []
    } as FormFieldModel;
  });

  it('should init parser properly', () => {
    const parser = new OneboxFieldParser(submissionId, field1, initFormValues, parserOptions);

    expect(parser instanceof OneboxFieldParser).toBe(true);
  });

  it('should return a DynamicQualdropModel object when selectableMetadata is multiple', () => {
    const parser = new OneboxFieldParser(submissionId, field2, initFormValues, parserOptions);

    const fieldModel = parser.parse();

    expect(fieldModel instanceof DynamicQualdropModel).toBe(true);
  });

  it('should return a DsDynamicInputModel object when selectableMetadata is not multiple', () => {
    const parser = new OneboxFieldParser(submissionId, field3, initFormValues, parserOptions);

    const fieldModel = parser.parse();

    expect(fieldModel instanceof DsDynamicInputModel).toBe(true);
  });

  it('should return a DynamicOneboxModel object when selectableMetadata has authority', () => {
    const parser = new OneboxFieldParser(submissionId, field1, initFormValues, parserOptions);

    const fieldModel = parser.parse();

    expect(fieldModel instanceof DynamicOneboxModel).toBe(true);
  });

});
