
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import {
  SortDirection,
  SortOptions,
} from '../../core/cache/models/sort-options.model';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { Context } from '../../core/shared/context.model';
import { ViewMode } from '../../core/shared/view-mode.model';
import { fadeIn } from '../animations/fade';
import { ErrorComponent } from '../error/error.component';
import { ThemedLoadingComponent } from '../loading/themed-loading.component';
import { CollectionElementLinkType } from '../object-collection/collection-element-link.type';
import { ListableObject } from '../object-collection/shared/listable-object.model';
import { TabulatableObjectsLoaderComponent } from '../object-collection/shared/tabulatable-objects/tabulatable-objects-loader.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'ds-object-table',
  templateUrl: './object-table.component.html',
  styleUrls: ['./object-table.component.scss'],
  animations: [fadeIn],
  imports: [
    ErrorComponent,
    PaginationComponent,
    TabulatableObjectsLoaderComponent,
    ThemedLoadingComponent,
    TranslateModule,
  ],
  standalone: true,
})

/**
 * Component used to wrap and load paginated search results if the ViewMode is set to Table.
 * Each ViewMode has a different type of wrapper that can be checked in ObjectCollectionComponent
 */
export class ObjectTableComponent {
  /**
   * The view mode of this component
   */
  viewMode = ViewMode.Table;

  /**
   * The current pagination configuration
   */
  @Input() config: PaginationComponentOptions;

  /**
   * The current sort configuration
   */
  @Input() sortConfig: SortOptions;

  /**
   * Whether or not the pagination should be rendered as simple previous and next buttons instead of the normal pagination
   */
  @Input() showPaginator = true;

  /**
   * Whether to show the thumbnail preview
   */
  @Input() showThumbnails;

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
   * Option for hiding the pagination detail
   */
  @Input() hidePaginationDetail = false;

  /**
   * Behavior subject to output the current listable objects
   */
  private _objects$: BehaviorSubject<RemoteData<PaginatedList<ListableObject>>>;

  /**
   * Setter to make sure the observable is turned into an observable
   * @param objects The new objects to output
   */
  @Input() set objects(objects: RemoteData<PaginatedList<ListableObject>>) {
    this._objects$.next(objects);
  }

  /**
   * Getter to return the current objects
   */
  get objects() {
    return this._objects$.getValue();
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
  @Output() paginationChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * An event fired when the sort field is changed.
   * Event's payload equals to the newly selected sort field.
   */
  @Output() sortFieldChange: EventEmitter<string> = new EventEmitter<string>();

  /**
   * If showPaginator is set to true, emit when the previous button is clicked
   */
  @Output() prev = new EventEmitter<boolean>();

  /**
   * If showPaginator is set to true, emit when the next button is clicked
   */
  @Output() next = new EventEmitter<boolean>();

  data: any = {};

  constructor() {
    this._objects$ = new BehaviorSubject(undefined);
  }

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

  /**
   * Go to the previous page
   */
  goPrev() {
    this.prev.emit(true);
  }

  /**
   * Go to the next page
   */
  goNext() {
    this.next.emit(true);
  }
}
