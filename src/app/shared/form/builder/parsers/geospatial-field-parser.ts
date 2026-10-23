import { FormFieldMetadataValueObject } from '@dspace/core/shared/form/models/form-field-metadata-value.model';

import {
  DynamicGeospatialMapModel,
  DynamicGeospatialMapModelConfig,
} from '../ds-dynamic-form-ui/models/geospatial-map/dynamic-geospatial-map.model';
import { FieldParser } from './field-parser';

/**
 * Parses a `geospatial` input-type field (e.g. `dcterms.spatial`) into a {@link DynamicGeospatialMapModel}.
 */
export class GeospatialFieldParser extends FieldParser {

  public modelFactory(fieldValue?: FormFieldMetadataValueObject, label?: boolean): any {
    const geospatialModelConfig: DynamicGeospatialMapModelConfig = this.initModel(null, label);
    this.setValues(geospatialModelConfig, fieldValue);

    return new DynamicGeospatialMapModel(geospatialModelConfig);
  }

}
