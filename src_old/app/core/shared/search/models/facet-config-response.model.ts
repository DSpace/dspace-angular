import { deserialize } from 'cerialize';

import { typedObject } from '../../../cache/builders/build-decorators';
import { CacheableObject } from '../../../cache/cacheable-object.model';
import { excludeFromEquals } from '../../../utilities/equals.decorators';
import { HALLink } from '../../hal-link.model';
import { FACET_CONFIG_RESPONSE } from '../types/facet-config-response.resouce-type';
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
