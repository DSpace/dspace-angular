  import { autoserialize, autoserializeAs } from 'cerialize';
  import { FacetValue } from './facet-value.model';
  import { FilterType } from './filter-type.model';

  /**
   * The configuration for a search filter
   */
  export class SearchFilterConfig {

    /**
     * The name of this filter
     */
    @autoserialize
    name: string;

    /**
     * The FilterType of this filter
     */
    @autoserializeAs(String, 'facetType')
    type: FilterType;

    /**
     * True if the filter has facets
     */
    @autoserialize
    hasFacets: boolean;

    /**
     * @type {number} The page size used for this facet
     */
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
     * The embedded facet values.
     */
    @autoserialize
    _embedded: { values: FacetValue[] };

    /**
     * Name of this configuration that can be used in a url
     * @returns Parameter name
     */
    get paramName(): string {
      return 'f.' + this.name;
    }
  }
