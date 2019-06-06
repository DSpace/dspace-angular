import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';

import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginatedList } from '../../core/data/paginated-list';

import { RemoteData } from '../../core/data/remote-data';
import { fadeIn } from '../animations/fade';
import { ListableObject } from '../object-collection/shared/listable-object.model';

import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';

/**
 * This component renders a paginated set of results in the detail view.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'ds-object-detail',
  styleUrls: [ './object-detail.component.scss' ],
  templateUrl: './object-detail.component.html',
  animations: [fadeIn]
})
export class ObjectDetailComponent {

  /**
   * Pagination options object
   */
  @Input() config: PaginationComponentOptions;

  /**
   * Sort options object
   */
  @Input() sortConfig: SortOptions;

  /**
   * A boolean representing if to hide gear pagination icon
   */
  @Input() hideGear = true;

  /**
   * A boolean representing if to hide pagination when there is only a page
   */
  @Input() hidePagerWhenSinglePage = true;

  /**
   * The list of objects to paginate
   */
  private _objects: RemoteData<PaginatedList<ListableObject>>;

  /**
   * Setter for _objects property
   * @param objects
   */
  @Input() set objects(objects: RemoteData<PaginatedList<ListableObject>>) {
    this._objects = objects;
  }

  /**
   * Getter for _objects property
   */
  get objects() {
    return this._objects;
  }

  /**
   * Option for hiding the pagination detail
   */
  public hidePaginationDetail = true;

  /**
   * An event fired when the page is changed.
   * Event's payload equals to the newly selected page.
   */
  @Output() change: EventEmitter<{
    pagination: PaginationComponentOptions,
    sort: SortOptions
  }> = new EventEmitter<{
    pagination: PaginationComponentOptions,
    sort: SortOptions
  }>();

  /**
   * An event fired when the page is changed.
   * Event's payload equals to the newly selected page.
   */
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  /**
   * An event fired when the page wsize is changed.
   * Event's payload equals to the newly selected page size.
   */
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

  /**
   * An event fired when the sort direction is changed.
   * Event's payload equals to the newly selected sort direction.
   */
  @Output() sortDirectionChange: EventEmitter<SortDirection> = new EventEmitter<SortDirection>();

  /**
   * An event fired when the pagination is changed.
   * Event's payload equals to the newly selected sort direction.
   */
  @Output() paginationChange: EventEmitter<SortDirection> = new EventEmitter<any>();

  /**
   * An event fired when the sort field is changed.
   * Event's payload equals to the newly selected sort field.
   */
  @Output() sortFieldChange: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Emit pageChange event
   */
  onPageChange(event) {
    this.pageChange.emit(event);
  }

  /**
   * Emit pageSizeChange event
   */
  onPageSizeChange(event) {
    this.pageSizeChange.emit(event);
  }

  /**
   * Emit sortDirectionChange event
   */
  onSortDirectionChange(event) {
    this.sortDirectionChange.emit(event);
  }

  /**
   * Emit sortFieldChange event
   */
  onSortFieldChange(event) {
    this.sortFieldChange.emit(event);
  }

  /**
   * Emit paginationChange event
   */
  onPaginationChange(event) {
    this.paginationChange.emit(event);
  }

}
