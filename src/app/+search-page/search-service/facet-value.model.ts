
import { autoserialize, autoserializeAs } from 'cerialize';

/**
 * Class representing possible values for a certain filter
 */
export class FacetValue {
  /**
   * The display value of the facet value
   */
  @autoserializeAs(String, 'label')
  value: string;

  /**
   * The number of results this facet value would have if selected
   */
  @autoserialize
  count: number;

  /**
   * The REST url to add this filter value
   */
  @autoserialize
  search: string;
}
