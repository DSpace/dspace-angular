import { autoserialize, autoserializeAs } from 'cerialize';

/**
 * Represents the state of a paginated response
 */
export class PageInfo {
  /**
   * The number of elements on a page
   */
  @autoserializeAs(Number, 'size')
  elementsPerPage: number;

  /**
   * The total number of elements in the entire set
   */
  @autoserialize
  totalElements: number;

  /**
   * The total number of pages
   */
  @autoserialize
  totalPages: number;

  /**
   * The number of the current page, zero-based
   */
  @autoserializeAs(Number, 'number')
  currentPage: number;

  @autoserialize
  last: string;

  @autoserialize
  next: string;

  @autoserialize
  prev: string;

  @autoserialize
  first: string;

  @autoserialize
  self: string;
}
