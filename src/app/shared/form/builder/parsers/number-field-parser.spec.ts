import { FormFieldModel } from '../models/form-field.model';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { ParserOptions } from './parser-options';
import { NumberFieldParser } from './number-field-parser';
import { DsDynamicInputModel } from '../ds-dynamic-form-ui/models/ds-dynamic-input.model';

describe('NumberFieldParser test suite', () => {
  let field: FormFieldModel;
  let initFormValues: any = {};

  const parserOptions: ParserOptions = {
    readOnly: false,
    submissionScope: null,
    authorityUuid: null
  };

  beforeEach(() => {
    field = {
      input: {
        type: 'number'
      },
      label: 'Number',
      mandatory: 'false',
      repeatable: false,
      hints: 'Enter a number.',
      selectableMetadata: [
        {
          metadata: 'number'
        }
      ],
      languageCodes: []
    } as FormFieldModel;

  });

  it('should init parser properly', () => {
    const parser = new NumberFieldParser(field, initFormValues, parserOptions);

    expect(parser instanceof NumberFieldParser).toBe(true);
  });

  it('should return a DsDynamicInputModel object when repeatable option is false', () => {
    const parser = new NumberFieldParser(field, initFormValues, parserOptions);

    const fieldModel = parser.parse();

    expect(fieldModel instanceof DsDynamicInputModel).toBe(true);
  });

  it('should have properly inputType', () => {
    const parser = new NumberFieldParser(field, initFormValues, parserOptions);

    const fieldModel = parser.parse();

    expect(fieldModel.inputType).toBe('number');
  });

  it('should set init value properly', () => {
    initFormValues = {
      number: [
        new FormFieldMetadataValueObject('1'),
      ],
    };
    const expectedValue = '1';

    const parser = new NumberFieldParser(field, initFormValues, parserOptions);

    const fieldModel = parser.parse();

    expect(fieldModel.value).toEqual(expectedValue);
  });

});
