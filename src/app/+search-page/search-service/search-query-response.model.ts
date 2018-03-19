import { autoserialize, autoserializeAs } from 'cerialize';
import { PageInfo } from '../../core/shared/page-info.model';
import { NormalizedSearchResult } from '../normalized-search-result.model';
import { SearchFilterConfig } from './search-filter-config.model';
import { SearchAppliedFilter } from './search-applied-filter.model';

export class SearchQueryResponse {
  @autoserialize
  scope: string;

  @autoserialize
  query: string;

  @autoserializeAs(SearchAppliedFilter)
  appliedFilters: SearchAppliedFilter[]; // TODO

  @autoserialize
  sort: any; // TODO

  @autoserialize
  configurationName: string;

  @autoserialize
  public type: string;

  @autoserialize
  page: PageInfo;

  @autoserializeAs(NormalizedSearchResult)
  objects: NormalizedSearchResult[];

  @autoserializeAs(SearchFilterConfig)
  facets: SearchFilterConfig[];

  @autoserialize
  self: string;

  @autoserialize
  next: string;

  @autoserialize
  previous: string;

  @autoserialize
  first: string;

  @autoserialize
  last: string;
}
