import {
  autoserialize,
  autoserializeAs,
  inheritSerialization,
} from 'cerialize';

import { typedObject } from '../../../cache/builders/build-decorators';
import { PaginatedList } from '../../../data/paginated-list.model';
import { excludeFromEquals } from '../../../utilities/equals.decorators';
import { FACET_VALUES } from '../types/facet-values.resource-type';
import { FacetValue } from './facet-value.model';
import { FilterType } from './filter-type.model';
import { SearchQueryResponse } from './search-query-response.model';

@typedObject
@inheritSerialization(PaginatedList)
@inheritSerialization(SearchQueryResponse)
export class FacetValues extends SearchQueryResponse<FacetValue> {
  static type = FACET_VALUES;

  /**
   * The sort parameters used in the search request
   * Hardcoded because rest doesn't provide a unique type
   */
  @excludeFromEquals
  public type = FACET_VALUES;

  /**
   * The name of the facet the values are for
   */
  @autoserialize
  name: string;

  /**
   * The type of facet the values are for
   */
  @autoserializeAs(String, 'facetType')
  filterType: FilterType;

  /**
   * The max number of returned facetValues
   */
  @autoserialize
  facetLimit: number;

  /**
   * The results for this query
   */
  @autoserializeAs(FacetValue, 'values')
  page: FacetValue[];
}
