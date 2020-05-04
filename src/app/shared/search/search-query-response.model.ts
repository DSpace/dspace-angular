import { autoserialize, autoserializeAs } from 'cerialize';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { SearchResult } from './search-result.model';

/**
 * Class representing the response returned by the server when performing a search request
 */
export class SearchQueryResponse {
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
  @autoserialize
  appliedFilters: any[]; // TODO

  /**
   * The sort parameters used in the search request
   */
  @autoserialize
  sort: any; // TODO

  /**
   * The sort parameters used in the search request
   */
  @autoserialize
  configuration: string;

  /**
   * The sort parameters used in the search request
   */
  @autoserialize
  public type: string;

  /**
   * Pagination configuration for this response
   */
  @autoserialize
  page: PageInfo;

  /**
   * The results for this query
   */
  @autoserializeAs(SearchResult)
  objects: Array<SearchResult<DSpaceObject>>;

  @autoserialize
  facets: any; // TODO

  /**
   * The REST url to retrieve the current response
   */
  @autoserialize
  self: string;

  /**
   * The REST url to retrieve the next response
   */
  @autoserialize
  next: string;

  /**
   * The REST url to retrieve the previous response
   */
  @autoserialize
  previous: string;

  /**
   * The REST url to retrieve the first response
   */
  @autoserialize
  first: string;

  /**
   * The REST url to retrieve the last response
   */
  @autoserialize
  last: string;
}
