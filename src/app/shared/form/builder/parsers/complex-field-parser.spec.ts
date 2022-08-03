import { FormFieldModel } from '../models/form-field.model';
import { ParserOptions } from './parser-options';
import { DynamicRowArrayModel } from '../ds-dynamic-form-ui/models/ds-dynamic-row-array-model';
import {ComplexFieldParser} from './complex-field-parser';

/**
 * The test class for the parser `complex-field-parser.ts`.
 * Test if that Parser correctly parse DynamicComplexModelConfig to the DynamicComplexModel.
 */
describe('ComplexFieldParser test suite', () => {
  let field: FormFieldModel;
  const initFormValues: any = {};

  const submissionId = '1234';
  const parserOptions: ParserOptions = {
    readOnly: false,
    submissionScope: null,
    collectionUUID: null,
    typeField: 'dc_type'
  };
  const separator = ';';

  beforeEach(() => {
    field = {
      input: {
        type: 'complex'
      },
      mandatory: 'false',
      label: 'Contact person',
      repeatable: true,
      hints: 'This is contact person',
      selectableMetadata: [
        {
          metadata: 'local.contact.person',
        }
      ],
      languageCodes: [],
      complexDefinition: '[{"givenname":{"name":"givenname","input-type":"text","label":"Given name",' +
        '"required":"true"}},{"surname":{"name":"surname","input-type":"text","label":"Surname",' +
        '"required":"true"}},{"email":{"name":"email","regex":"[^@]+@[^\\\\.@]+\\\\.[^@]+","input-type":' +
        '"text","label":"Email","required":"true"}},{"affiliation":{"name":"affiliation","input-type":' +
        '"text","label":"Affiliation"}}]'
    } as FormFieldModel;

  });

  it('should init parser properly', () => {
    const parser = new ComplexFieldParser(submissionId, field, initFormValues, parserOptions, separator, []);

    expect(parser instanceof ComplexFieldParser).toBe(true);
  });

  it('should return a DynamicRowArrayModel object with expected label', () => {
    const parser = new ComplexFieldParser(submissionId, field, initFormValues, parserOptions, separator, []);

    const expectedValue = 'Contact person';
    const fieldModel = parser.parse();

    expect(fieldModel instanceof DynamicRowArrayModel).toBe(true);
    expect(fieldModel.label).toBe(expectedValue);
  });
});
