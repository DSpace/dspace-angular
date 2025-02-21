import {
  autoserializeAs,
  inheritSerialization,
} from 'cerialize';

import { typedObject } from '../../../cache';
import { PaginatedList } from '../../../data';
import { excludeFromEquals } from '../../../utilities';
import { DSpaceObject } from '../../dspace-object.model';
import { SEARCH_OBJECTS } from '../types';
import { SearchQueryResponse } from './search-query-response.model';
import { SearchResult } from './search-result.model';

/**
 * Class representing the response returned by the server when performing a search request
 */
@typedObject
@inheritSerialization(PaginatedList)
@inheritSerialization(SearchQueryResponse)
export class SearchObjects<T extends DSpaceObject> extends SearchQueryResponse<SearchResult<T>> {
  static type = SEARCH_OBJECTS;

  /**
   * The sort parameters used in the search request
   * Hardcoded because rest doesn't provide a unique type
   */
  @excludeFromEquals
  public type = SEARCH_OBJECTS;

  /**
   * The results for this query
   */
  @autoserializeAs(SearchResult, 'objects')
  page: SearchResult<T>[];
}
