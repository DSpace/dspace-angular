import { autoserialize } from 'cerialize';

/**
 * The configuration of the operator of a search filter when applied, e.g. "equals"
 */
export class SearchFilterOperator {
  /**
   * The name of the operator
   */
  @autoserialize
  operator: string;
}
