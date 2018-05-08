import { autoserialize, autoserializeAs } from 'cerialize';
import { PageInfo } from '../../core/shared/page-info.model';
import { NormalizedSearchResult } from '../normalized-search-result.model';

export class SearchQueryResponse {
  @autoserialize
  scope: string;

  @autoserialize
  query: string;

  @autoserialize
  appliedFilters: any[]; // TODO

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

  @autoserialize
  facets: any; // TODO

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
