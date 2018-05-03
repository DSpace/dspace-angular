  import { FilterType } from './filter-type.model';
  import { autoserialize, autoserializeAs } from 'cerialize';

  export class SearchFilterConfig {

    @autoserialize
    name: string;

    @autoserializeAs(String, 'facetType')
    type: FilterType;

    @autoserialize
    hasFacets: boolean;

    // @autoserializeAs(String, 'facetLimit') - uncomment when fixed in rest
    pageSize = 5;

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
