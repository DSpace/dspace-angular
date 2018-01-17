import { autoserialize, autoserializeAs } from 'cerialize';
import { Equatable } from './equatable.mixin';
import { applyMixins } from 'rxjs/util/applyMixins';

/**
 * Represents the state of a paginated response
 */
export class PageInfo implements Equatable {
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

  equals: (o: PageInfo) => boolean;
}
applyMixins(PageInfo, [Equatable]);
