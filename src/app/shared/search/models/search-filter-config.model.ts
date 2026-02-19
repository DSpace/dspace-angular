import {
  autoserialize,
  autoserializeAs,
  deserialize,
} from 'cerialize';

import { typedObject } from '../../../core/cache/builders/build-decorators';
import { CacheableObject } from '../../../core/cache/cacheable-object.model';
import { HALLink } from '../../../core/shared/hal-link.model';
import { excludeFromEquals } from '../../../core/utilities/equals.decorators';
import { FilterType } from './filter-type.model';
import { SEARCH_FILTER_CONFIG } from './types/search-filter-config.resource-type';
import { SearchFilterOperator } from './search-filter-operator.model';

/**
 * The configuration for a search filter
 */
@typedObject
export class SearchFilterConfig implements CacheableObject {
  static type = SEARCH_FILTER_CONFIG;

  /**
   * The object type,
   * hardcoded because rest doesn't set one.
   */
  @excludeFromEquals
  @autoserialize
  type = SEARCH_FILTER_CONFIG;

  /**
   * The name of this filter
   */
  @autoserializeAs(String, 'filter')
  name: string;

  @autoserialize
  filter: string;

  /**
   * The FilterType of this filter
   */
  @autoserializeAs(String)
  filterType: FilterType;

  /**
   * True if the filter has facets
   */
  @autoserialize
  hasFacets: boolean;

  /**
   * @type {number} The page size used for this facet
   */
  @autoserialize
  pageSize = 5;

  @autoserialize
  operators: SearchFilterOperator[];

  /**
   * Defines if the item facet is collapsed by default or not on the search page
   */
  @autoserializeAs(Boolean, 'openByDefault')
  isOpenByDefault: boolean;

  /**
   * Minimum value possible for this facet in the repository
   */
  // TODO: This was moved to the Facet response
  @autoserialize
  maxValue: string;

  /**
   * Maximum value possible for this facet in the repository
   */
  // TODO: This was moved to the Facet response
  @autoserialize
  minValue: string;

  /**
   * The {@link HALLink}s for this SearchFilterConfig
   */
  @deserialize
  _links: {
    self: HALLink;
  };

  /**
   * Name of this configuration that can be used in a url
   * @returns Parameter name
   */
  get paramName(): string {
    return 'f.' + this.filter;
  }
}
