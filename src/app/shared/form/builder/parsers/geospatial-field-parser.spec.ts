import { FormFieldModel } from '@dspace/core/shared/form/models/form-field.model';
import { FormFieldMetadataValueObject } from '@dspace/core/shared/form/models/form-field-metadata-value.model';
import { getMockTranslateService } from '@dspace/core/testing/translate.service.mock';

import { DynamicGeospatialMapModel } from '../ds-dynamic-form-ui/models/geospatial-map/dynamic-geospatial-map.model';
import { GeospatialFieldParser } from './geospatial-field-parser';
import { ParserOptions } from './parser-options';

describe('GeospatialFieldParser test suite', () => {
  let field: FormFieldModel;
  let initFormValues: any = {};
  const translateService = getMockTranslateService();

  const submissionId = '1234';
  const parserOptions: ParserOptions = {
    readOnly: false,
    submissionScope: null,
    collectionUUID: null,
    typeField: 'dc_type',
    isInnerForm: false,
  };

  beforeEach(() => {
    field = {
      input: {
        type: 'geospatial',
      },
      label: 'Geospatial point',
      mandatory: 'false',
      repeatable: false,
      hints: 'Enter a WKT point.',
      selectableMetadata: [
        {
          metadata: 'dcterms.spatial',
        },
      ],
      languageCodes: [],
    } as FormFieldModel;
  });

  it('should init parser properly', () => {
    const parser = new GeospatialFieldParser(submissionId, field, initFormValues, parserOptions, null, translateService);

    expect(parser instanceof GeospatialFieldParser).toBe(true);
  });

  it('should return a DynamicGeospatialMapModel object when repeatable option is false', () => {
    const parser = new GeospatialFieldParser(submissionId, field, initFormValues, parserOptions, null, translateService);

    const fieldModel = parser.parse();

    expect(fieldModel instanceof DynamicGeospatialMapModel).toBe(true);
  });

  it('should set init value properly', () => {
    initFormValues = {
      'dcterms.spatial': [
        new FormFieldMetadataValueObject('POINT(19.0455 47.5072)'),
      ],
    };
    const expectedValue = 'POINT(19.0455 47.5072)';

    const parser = new GeospatialFieldParser(submissionId, field, initFormValues, parserOptions, null, translateService);

    const fieldModel = parser.parse();

    expect(fieldModel.value).toEqual(expectedValue);
  });

});
