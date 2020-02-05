import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { PaginatedList } from '../../core/data/paginated-list';

@Component({
  selector: 'ds-pagination-drag-and-drop',
  templateUrl: './pagination-drag-and-drop.component.html',
})
export class PaginationDragAndDropComponent {
  /**
   * Configuration for the NgbPagination component.
   */
  @Input() paginationOptions: PaginationComponentOptions;

  /**
   * The paginated list being displayed
   */
  @Input() paginatedList: PaginatedList<any>;

  /**
   * Option for hiding the pagination detail
   */
  @Input() public hidePaginationDetail = false;

  /**
   * Option for hiding the gear
   */
  @Input() public hideGear = false;

  /**
   * Option for hiding the pager when there is less than 2 pages
   */
  @Input() public hidePagerWhenSinglePage = true;

  /**
   * Option for disabling updating and reading route parameters on pagination changes
   * In other words, changing pagination won't add or update the url parameters on the current page, and the url
   * parameters won't affect the pagination of this component
   */
  @Input() public disableRouteParameterUpdate = false;

  /**
   * An event fired when the page is changed.
   * Event's payload equals to the newly selected page.
   */
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Switch to a different page
   * @param page  Page to switch to
   */
  switchPage(page: number) {
    this.pageChange.emit(page);
  }
}
