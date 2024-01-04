import { typedObject } from '../../../core/cache/builders/build-decorators';
import { excludeFromEquals } from '../../../core/utilities/equals.decorators';
import { deserialize } from 'cerialize';
import { HALLink } from '../../../core/shared/hal-link.model';
import { CacheableObject } from '../../../core/cache/cacheable-object.model';
import { AdminNotifySearchFilterConfig } from './admin-notify-search-filter-config';
import { FACET_CONFIG_RESPONSE } from '../../../shared/search/models/types/facet-config-response.resouce-type';

/**
 * The response from the discover/facets endpoint
 */
@typedObject
export class AdminNotifyFacetConfigResponse implements CacheableObject {
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
  filters: AdminNotifySearchFilterConfig[];

  /**
   * The {@link HALLink}s for this SearchFilterConfig
   */
  @deserialize
  _links: {
    self: HALLink;
  };
}
