import {
  autoserialize,
  autoserializeAs,
} from 'cerialize';

import { PaginatedList } from '../../../core/data/paginated-list.model';
import { PageInfo } from '../../../core/shared/page-info.model';
import { AppliedFilter } from './applied-filter.model';
import { SearchResultSorting } from './search-result-sorting.model';

/**
 * Class representing the response returned by the server when performing a search request
 */
export abstract class SearchQueryResponse<T> extends PaginatedList<T> {
  /**
   * The scope used in the search request represented by the UUID of a DSpaceObject
   */
  @autoserialize
  scope: string;

  /**
   * The search query used in the search request
   */
  @autoserialize
  query: string;

  /**
   * The currently active filters used in the search request
   */
  @autoserializeAs(AppliedFilter)
  appliedFilters: AppliedFilter[];

  /**
   * The sort parameters used in the search request
   */
  @autoserializeAs(SearchResultSorting)
  sort: SearchResultSorting;

  /**
   * The sort parameters used in the search request
   */
  @autoserialize
  configuration: string;

  /**
   * Pagination configuration for this response
   */
  @autoserialize
  pageInfo: PageInfo;

  /**
   * The results for this query
   */
  @autoserialize
  page: T[];

  @autoserialize
  facets: any; // TODO
}
