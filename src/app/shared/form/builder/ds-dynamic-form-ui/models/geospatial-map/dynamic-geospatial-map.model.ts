import {
  DynamicFormControlLayout,
  serializable,
} from '@ng-dynamic-forms/core';

import {
  DsDynamicInputModel,
  DsDynamicInputModelConfig,
} from '../ds-dynamic-input.model';

export const DYNAMIC_FORM_CONTROL_TYPE_GEOSPATIAL_MAP = 'GEOSPATIAL_MAP';

export interface DynamicGeospatialMapModelConfig extends DsDynamicInputModelConfig {
  value?: any;
}

/**
 * Model for a single geospatial point field (e.g. `dcterms.spatial`), stored as a WKT `POINT(longitude latitude)`
 * string. Rendered by {@link DsDynamicGeospatialMapComponent}.
 */
export class DynamicGeospatialMapModel extends DsDynamicInputModel {

  @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_GEOSPATIAL_MAP;

  constructor(config: DynamicGeospatialMapModelConfig, layout?: DynamicFormControlLayout) {
    super(config, layout);
  }

}
