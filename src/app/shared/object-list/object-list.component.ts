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
import { ViewMode } from '../../core/shared/view-mode.model';
import { Context } from '../../core/shared/context.model';
import { CollectionElementLinkType } from '../object-collection/collection-element-link.type';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'ds-object-list',
  styleUrls: ['./object-list.component.scss'],
  templateUrl: './object-list.component.html',
  animations: [fadeIn]
})
export class ObjectListComponent {
  /**
   * The view mode of the this component
   */
  viewMode = ViewMode.ListElement;

  /**
   * The current pagination configuration
   */
  @Input() config: PaginationComponentOptions;

  /**
   * The current sort configuration
   */
  @Input() sortConfig: SortOptions;

  /**
   * Whether or not the list elements have a border
   */
  @Input() hasBorder = false;

  /**
   * The whether or not the gear is hidden
   */
  @Input() hideGear = false;

  /**
   * Whether or not the pager is visible when there is only a single page of results
   */
  @Input() hidePagerWhenSinglePage = true;

  /**
   * The link type of the listable elements
   */
  @Input() linkType: CollectionElementLinkType;

  /**
   * The context of the listable elements
   */
  @Input() context: Context;

  /**
   * The current listable objects
   */
  private _objects: RemoteData<PaginatedList<ListableObject>>;

  /**
   * Setter for the objects
   * @param objects The new objects
   */
  @Input() set objects(objects: RemoteData<PaginatedList<ListableObject>>) {
    this._objects = objects;
  }

  /**
   * Getter to return the current objects
   */
  get objects() {
    return this._objects;
  }

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
   * An event fired when on of the pagination parameters changes
   */
  @Output() paginationChange: EventEmitter<SortDirection> = new EventEmitter<any>();

  /**
   * An event fired when the sort field is changed.
   * Event's payload equals to the newly selected sort field.
   */
  @Output() sortFieldChange: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Emits the current page when it changes
   * @param event The new page
   */
  onPageChange(event) {
    this.pageChange.emit(event);
  }

  /**
   * Emits the current page size when it changes
   * @param event The new page size
   */
  onPageSizeChange(event) {
    this.pageSizeChange.emit(event);
  }
  /**
   * Emits the current sort direction when it changes
   * @param event The new sort direction
   */
  onSortDirectionChange(event) {
    this.sortDirectionChange.emit(event);
  }

  /**
   * Emits the current sort field when it changes
   * @param event The new sort field
   */
  onSortFieldChange(event) {
    this.sortFieldChange.emit(event);
  }

  /**
   * Emits the current pagination when it changes
   * @param event The new pagination
   */
  onPaginationChange(event) {
    this.paginationChange.emit(event);
  }

}
