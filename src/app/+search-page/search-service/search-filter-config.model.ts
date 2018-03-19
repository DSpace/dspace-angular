import { FilterType } from './filter-type.model';
import { autoserialize, autoserializeAs } from 'cerialize';
import { FacetValue } from './facet-value.model';

export class SearchFilterConfig {
  @autoserialize
  scope: string;

  @autoserialize
  query: string;

  @autoserialize
  sort: any; // TODO

  @autoserialize
  configurationName: string;

  @autoserialize
  name: string;

  @autoserialize
  facetType: FilterType;

  @autoserialize
  facetLimit: number;

  @autoserialize
  hasFacets: boolean;

  @autoserialize
  pageSize = 5;

  @autoserialize
  public type: string;

  @autoserializeAs(FacetValue)
  values: FacetValue[];

  @autoserialize
  isOpenByDefault: boolean;
  /**
   * Name of this configuration that can be used in a url
   * @returns Parameter name
   */
  get paramName(): string {
    return 'f.' + this.name;
  }
}
