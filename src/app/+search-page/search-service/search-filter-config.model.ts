  import { FilterType } from './filter-type.model';
  import { autoserialize, autoserializeAs } from 'cerialize';

  /**
   *
   */
  export class SearchFilterConfig {

    @autoserialize
    name: string;

    @autoserializeAs(String, 'facetType')
    type: FilterType;

    @autoserialize
    hasFacets: boolean;

    @autoserializeAs(String, 'facetLimit')
    pageSize = 5;

    /**
     * Defines if the item facet is collapsed by default or not on the search page
     */
    @autoserialize
    isOpenByDefault: boolean;

    /**
     * Minimum value possible for this facet in the repository
     */
    @autoserialize
    maxValue: string;

    /**
     * Maximum value possible for this facet in the repository
     */
    @autoserialize
    minValue: string;
    /**
     * Name of this configuration that can be used in a url
     * @returns Parameter name
     */
    get paramName(): string {
      return 'f.' + this.name;
    }
  }
