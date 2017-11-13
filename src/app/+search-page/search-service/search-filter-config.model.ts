import { FilterType } from './filter-type.model';

export class SearchFilterConfig {

  name: string;
  type: FilterType;
  hasFacets: boolean;
  pageSize = 2;
  isOpenByDefault: boolean;
  /**
   * Name of this configuration that can be used in a url
   * @returns Parameter name
   */
  get paramName(): string {
    return 'f.' + this.name;
  }
}
