import { FormFieldModel } from '../models/form-field.model';
import { DynamicConcatModel } from '../ds-dynamic-form-ui/models/ds-dynamic-concat.model';
import { SeriesFieldParser } from './series-field-parser';

describe('SeriesFieldParser test suite', () => {
  let field: FormFieldModel;

  const initFormValues = {};
  const readOnly = false;

  beforeEach(() => {
    field = {
      input: {type: 'series'},
      label: 'Series/Report No.',
      mandatory: 'false',
      repeatable: false,
      hints: 'Enter the series and number assigned to this item by your community.',
      selectableMetadata: [
        {
          metadata: 'series',
        }
      ],
      languageCodes: []
    } as FormFieldModel;

  });

  it('should init parser properly', () => {
    const parser = new SeriesFieldParser(field, initFormValues, readOnly);

    expect(parser instanceof SeriesFieldParser).toBe(true);
  });

  it('should return a DynamicConcatModel object when repeatable option is false', () => {
    const parser = new SeriesFieldParser(field, initFormValues, readOnly);

    const fieldModel = parser.parse();

    expect(fieldModel instanceof DynamicConcatModel).toBe(true);
  });

  it('should return a DynamicConcatModel object with the correct separator', () => {
    const parser = new SeriesFieldParser(field, initFormValues, readOnly);

    const fieldModel = parser.parse();

    expect((fieldModel as DynamicConcatModel).separator).toBe('; ');
  });

});
