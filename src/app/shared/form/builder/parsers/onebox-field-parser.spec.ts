import { OneboxFieldParser } from './onebox-field-parser';
import { ParserOptions } from './parser-options';
import { DsDynamicInputModel } from '../ds-dynamic-form-ui/models/ds-dynamic-input.model';
import { DynamicQualdropModel } from '../ds-dynamic-form-ui/models/ds-dynamic-qualdrop.model';
import { DynamicTypeaheadModel } from '../ds-dynamic-form-ui/models/typeahead/dynamic-typeahead.model';
import { FormFieldModel } from '../models/form-field.model';

describe('OneboxFieldParser test suite', () => {
  let field1: FormFieldModel;
  let field2: FormFieldModel;
  let field3: FormFieldModel;

  const initFormValues = {};
  const parserOptions: ParserOptions = {
    readOnly: false,
    submissionScope: 'testScopeUUID',
    authorityUuid: null
  };

  beforeEach(() => {
    field1 = {
      input: {type: 'onebox'},
      label: 'Title',
      mandatory: 'false',
      repeatable: false,
      hints: 'Enter the name of the events, if any.',
      selectableMetadata: [
        {
          metadata: 'title',
          authority: 'EVENTAuthority',
          closed: false
        }
      ],
      languageCodes: []
    } as FormFieldModel;

    field2 = {
      hints: 'If the item has any identification numbers or codes associated with↵	it, please enter the types and the actual numbers or codes.',
      input: {type: 'onebox'},
      label: 'Identifiers',
      languageCodes: [],
      mandatory: 'false',
      repeatable: false,
      selectableMetadata: [
        {metadata: 'dc.identifier.issn', label: 'ISSN'},
        {metadata: 'dc.identifier.other', label: 'Other'},
        {metadata: 'dc.identifier.ismn', label: 'ISMN'},
        {metadata: 'dc.identifier.govdoc', label: 'Gov\'t Doc #'},
        {metadata: 'dc.identifier.uri', label: 'URI'},
        {metadata: 'dc.identifier.isbn', label: 'ISBN'},
        {metadata: 'dc.identifier.doi', label: 'DOI'},
        {metadata: 'dc.identifier.pmid', label: 'PubMed ID'},
        {metadata: 'dc.identifier.arxiv', label: 'arXiv'}
      ]
    } as FormFieldModel;

    field3 = {
      input: {type: 'onebox'},
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
    const parser = new OneboxFieldParser(field1, initFormValues, parserOptions);

    expect(parser instanceof OneboxFieldParser).toBe(true);
  });

  it('should return a DynamicQualdropModel object when selectableMetadata is multiple', () => {
    const parser = new OneboxFieldParser(field2, initFormValues, parserOptions);

    const fieldModel = parser.parse();

    expect(fieldModel instanceof DynamicQualdropModel).toBe(true);
  });

  it('should return a DsDynamicInputModel object when selectableMetadata is not multiple', () => {
    const parser = new OneboxFieldParser(field3, initFormValues, parserOptions);

    const fieldModel = parser.parse();

    expect(fieldModel instanceof DsDynamicInputModel).toBe(true);
  });

  it('should return a DynamicTypeaheadModel object when selectableMetadata has authority', () => {
    const parser = new OneboxFieldParser(field1, initFormValues, parserOptions);

    const fieldModel = parser.parse();

    expect(fieldModel instanceof DynamicTypeaheadModel).toBe(true);
  });

});
