import { deserialize } from 'cerialize';

import {
  CacheableObject,
  typedObject,
} from '../../../cache';
import { excludeFromEquals } from '../../../utilities';
import { HALLink } from '../../hal-link.model';
import { FACET_CONFIG_RESPONSE } from '../types';
import { SearchFilterConfig } from './search-filter-config.model';

/**
 * The response from the discover/facets endpoint
 */
@typedObject
export class FacetConfigResponse implements CacheableObject {
  static type = FACET_CONFIG_RESPONSE;

  /**
   * The object type,
   * hardcoded because rest doesn't a unique one.
   */
  @excludeFromEquals
  type = FACET_CONFIG_RESPONSE;

  /**
   * the filters in this response
   */
  filters: SearchFilterConfig[];

  /**
   * The {@link HALLink}s for this SearchFilterConfig
   */
  @deserialize
  _links: {
    self: HALLink;
  };
}
