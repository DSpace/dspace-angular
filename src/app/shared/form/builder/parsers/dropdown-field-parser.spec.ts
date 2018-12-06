import { DropdownFieldParser } from './dropdown-field-parser';
import { ParserOptions } from './parser-options';
import { DynamicScrollableDropdownModel } from '../ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { FormFieldModel } from '../models/form-field.model';

describe('DropdownFieldParser test suite', () => {
  let field: FormFieldModel;

  const initFormValues = {};
  const parserOptions: ParserOptions = {
    readOnly: false,
    submissionScope: 'testScopeUUID',
    authorityUuid: null
  };

  beforeEach(() => {
    field = {
      input: {
        type: 'dropdown'
      },
      label: 'Type',
      mandatory: 'false',
      repeatable: false,
      hints: 'Select the tyupe.',
      selectableMetadata: [
        {
          metadata: 'type',
          authority: 'common_types_dataset',
          closed: false
        }
      ],
      languageCodes: []
    } as FormFieldModel;

  });

  it('should init parser properly', () => {
    const parser = new DropdownFieldParser(field, initFormValues, parserOptions);

    expect(parser instanceof DropdownFieldParser).toBe(true);
  });

  it('should return a DynamicScrollableDropdownModel object when repeatable option is false', () => {
    const parser = new DropdownFieldParser(field, initFormValues, parserOptions);

    const fieldModel = parser.parse();

    expect(fieldModel instanceof DynamicScrollableDropdownModel).toBe(true);
  });

  it('should throw when authority is not passed', () => {
    field.selectableMetadata[0].authority = null;
    const parser = new DropdownFieldParser(field, initFormValues, parserOptions);

    expect(() => parser.parse())
      .toThrow();
  });

});
