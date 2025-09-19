import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import {
  NgbDropdownModule,
  NgbPaginationModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  map,
  startWith,
  switchMap,
  take,
} from 'rxjs/operators';

import {
  SortDirection,
  SortOptions,
} from '../../core/cache/models/sort-options.model';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { PaginationService } from '../../core/pagination/pagination.service';
import { PaginationRouteParams } from '../../core/pagination/pagination-route-params.interface';
import { ViewMode } from '../../core/shared/view-mode.model';
import { BtnDisabledDirective } from '../btn-disabled.directive';
import {
  hasValue,
  hasValueOperator,
} from '../empty.util';
import { HostWindowService } from '../host-window.service';
import { ListableObject } from '../object-collection/shared/listable-object.model';
import { RSSComponent } from '../rss-feed/rss.component';
import { EnumKeysPipe } from '../utils/enum-keys-pipe';
import { PaginationComponentOptions } from './pagination-component-options.model';

interface PaginationDetails {
  range: string;
  total: number;
}

/**
 * The default pagination controls component.
 */
@Component({
  exportAs: 'paginationComponent',
  selector: 'ds-pagination',
  styleUrls: ['pagination.component.scss'],
  templateUrl: 'pagination.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  standalone: true,
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    EnumKeysPipe,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTooltipModule,
    NgClass,
    RSSComponent,
    TranslateModule,
  ],
})
export class PaginationComponent implements OnChanges, OnDestroy, OnInit {
  /**
   * ViewMode that should be passed to {@link ListableObjectComponentLoaderComponent}.
   */
  viewMode: ViewMode = ViewMode.ListElement;

  /**
   * Number of items in collection.
   */
  @Input() collectionSize: number;

  /**
   * Configuration for the NgbPagination component.
   */
  @Input() paginationOptions: PaginationComponentOptions;

  /**
   * Sort configuration for this component.
   */
  @Input() sortOptions: SortOptions;

  /**
   * Whether or not the pagination should be rendered as simple previous and next buttons instead of the normal pagination
   */
  @Input() showPaginator = true;

  /**
   * The current pagination configuration
   */
   @Input() config?: PaginationComponentOptions;

  /**
   * The list of listable objects to render in this component
   */
  @Input() objects: RemoteData<PaginatedList<ListableObject>>;

  /**
   * The current sorting configuration
   */
  @Input() sortConfig: SortOptions;

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
   * An event fired when the sort field is changed.
   * Event's payload equals to the newly selected sort field.
   */
  @Output() sortFieldChange: EventEmitter<string> = new EventEmitter<string>();

  /**
   * An event fired when the pagination is changed.
   * Event's payload equals to the newly selected sort field.
   */
  @Output() paginationChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Option for hiding the pagination detail
   */
  @Input() public hidePaginationDetail = false;

  /**
   * Option for hiding the gear
   */
  @Input() public hideGear = false;

  /**
   * Option for hiding the gear
   */
  @Input() public hideSortOptions = false;

  /**
   * Option for hiding the pager when there is less than 2 pages
   */
  @Input() public hidePagerWhenSinglePage = true;

  /**
   * Option for retaining the scroll position upon navigating to an url with updated params.
   * After the page update the page will scroll back to the current pagination component.
   */
  @Input() public retainScrollPosition = false;

  /**
   * Options for showing or hiding the RSS syndication feed. This is useful for e.g. top-level community lists
   * or other lists where an RSS feed doesn't make sense, but uses the same components as recent items or search result
   * lists.
   */
  @Input() public showRSS: SortOptions | boolean = false;

  /**
   * Current page.
   */
  public currentPage$: Observable<number>;

  /**
   * Current page in the state of a Remote paginated objects.
   */
  public currentPageState: number = undefined;

  /**
   * ID for the pagination instance. This ID is used in the routing to retrieve the pagination options.
   * This ID needs to be unique between different pagination components when more than one will be displayed on the same page.
   */
  public id: string;

  /**
   * A boolean that indicate if is an extra small devices viewport.
   */
  public isXs: boolean;

  /**
   * Number of items per page.
   */
  public pageSize$: Observable<number>;

  /**
   * Declare SortDirection enumeration to use it in the template
   */
  public sortDirections = SortDirection;

  /**
   * A number array that represents options for a context pagination limit.
   */
  public pageSizeOptions: number[];

  /**
   * Direction in which to sort: ascending or descending
   */
  public sortDirection$: Observable<SortDirection>;
  public defaultsortDirection: SortDirection = SortDirection.ASC;

  /**
   * Name of the field that's used to sort by
   */
  public sortField$: Observable<string>;
  public defaultSortField = 'name';


  public showingDetails$: Observable<PaginationDetails>;

  /**
   * Whether the current pagination should show a bottom pages
   */
  showBottomPager$: Observable<boolean>;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  /**
   * If showPaginator is set to true, emit when the previous button is clicked
   */
  @Output() prev = new EventEmitter<boolean>();

  /**
   * If showPaginator is set to true, emit when the next button is clicked
   */
  @Output() next = new EventEmitter<boolean>();
  /**
   * Method provided by Angular. Invoked after the constructor.
   */
  ngOnInit() {
    this.subs.push(this.hostWindowService.isXs()
      .subscribe((status: boolean) => {
        this.isXs = status;
        this.cdRef.markForCheck();
      }));
    this.checkConfig(this.paginationOptions);
    this.initializeConfig();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (hasValue(changes.collectionSize)) {
      this.showingDetails$ = this.getShowingDetails(this.collectionSize);
    }
  }

  /**
   * Method provided by Angular. Invoked when the instance is destroyed.
   */
  ngOnDestroy() {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

  /**
   * Initializes all default variables
   */
  private initializeConfig() {
    this.id = this.paginationOptions.id || null;
    this.pageSizeOptions = this.paginationOptions.pageSizeOptions;
    this.currentPage$ = this.paginationService.getCurrentPagination(this.id, this.paginationOptions).pipe(
      map((currentPagination) => currentPagination.currentPage),
    );
    this.pageSize$ = this.paginationService.getCurrentPagination(this.id, this.paginationOptions).pipe(
      map((currentPagination) => currentPagination.pageSize),
    );

    let sortOptions: SortOptions;
    if (this.sortOptions) {
      sortOptions = this.sortOptions;
    } else {
      sortOptions = new SortOptions(this.defaultSortField, this.defaultsortDirection);
    }
    this.sortDirection$ = this.paginationService.getCurrentSort(this.id, sortOptions).pipe(
      map((currentSort) => currentSort.direction),
    );
    this.sortField$ = this.paginationService.getCurrentSort(this.id, sortOptions).pipe(
      map((currentSort) => currentSort.field),
    );
    this.showBottomPager$ = this.shouldShowBottomPager;
  }

  constructor(
    protected cdRef: ChangeDetectorRef,
    protected paginationService: PaginationService,
    public hostWindowService: HostWindowService,
  ) {
  }

  /**
   * Method to change the route to the given page
   *
   * @param page
   *    The page being navigated to.
   */
  public doPageChange(page: number) {
    this.updateParams({ page: page });
    this.emitPaginationChange();
  }

  /**
   * Method to change the route to the given page size
   *
   * @param pageSize
   *    The page size being navigated to.
   */
  public doPageSizeChange(pageSize: number) {
    this.updateParams({ page: 1, pageSize: pageSize });
    this.emitPaginationChange();
  }

  /**
   * Method to change the route to the given sort direction
   *
   * @param sortDirection
   *    The sort direction being navigated to.
   */
  public doSortDirectionChange(sortDirection: SortDirection) {
    this.updateParams({ page: 1, sortDirection: sortDirection });
    this.emitPaginationChange();
  }

  /**
   * Method to emit a general pagination change event
   */
  private emitPaginationChange() {
    this.paginationChange.emit();
  }

  /**
   * Update the current query params and optionally update the route
   * @param params
   */
  private updateParams(params: PaginationRouteParams) {
    this.paginationService.updateRoute(this.id, params, {}, this.retainScrollPosition);
  }

  /**
   * Method to get pagination details of the current viewed page.
   */
  public getShowingDetails(collectionSize: number): Observable<PaginationDetails> {
    return of(collectionSize).pipe(
      hasValueOperator(),
      switchMap(() => this.paginationService.getCurrentPagination(this.id, this.paginationOptions)),
      map((currentPaginationOptions) => {
        let lastItem: number;
        const pageMax = currentPaginationOptions.pageSize * currentPaginationOptions.currentPage;

        const firstItem: number = currentPaginationOptions.pageSize * (currentPaginationOptions.currentPage - 1) + 1;
        if (collectionSize > pageMax) {
          lastItem = pageMax;
        } else {
          lastItem = collectionSize;
        }
        return {
          range: `${firstItem} - ${lastItem}`,
          total: collectionSize,
        };
      }),
      startWith({
        range: `${null} - ${null}`,
        total: null,
      }),
    );
  }

  /**
   * Method to ensure options passed contains the required properties.
   *
   * @param paginateOptions
   *    The paginate options object.
   */
  private checkConfig(paginateOptions: any) {
    const required = ['id', 'currentPage', 'pageSize', 'pageSizeOptions'];
    const missing = required.filter((prop) => {
      return !(prop in paginateOptions);
    });
    if (0 < missing.length) {
      throw new Error('Paginate: Argument is missing the following required properties: ' + missing.join(', '));
    }
  }

  /**
   * Property to check whether the current pagination object has multiple pages
   * @returns true if there are multiple pages, else returns false
   */
  get hasMultiplePages(): Observable<boolean> {
    return this.paginationService.getCurrentPagination(this.id, this.paginationOptions).pipe(
      map((currentPaginationOptions) =>  this.collectionSize > currentPaginationOptions.pageSize),
    );
  }

  /**
   * Property to check whether the current pagination should show a bottom pages
   * @returns true if a bottom pages should be shown, else returns false
   */
  get shouldShowBottomPager(): Observable<boolean> {
    return this.hasMultiplePages.pipe(
      map((hasMultiplePages) => hasMultiplePages || !this.hidePagerWhenSinglePage),
    );
  }

  /**
   * Go to the previous page
   */
  goPrev() {
    this.prev.emit(true);
    this.updatePagination(-1);
  }

  /**
   * Go to the next page
   */
  goNext() {
    this.next.emit(true);
    this.updatePagination(1);
  }

  /**
   * Update page when next or prev button is clicked
   * @param value
   */
  updatePagination(value: number) {
    this.paginationService.getCurrentPagination(this.id, this.paginationOptions).pipe(take(1)).subscribe((currentPaginationOptions) => {
      this.updateParams({ page: (currentPaginationOptions.currentPage + value) });
    });
  }

  /**
   * Get the sort options to use for the RSS feed. Defaults to the sort options used for this pagination component
   * so it matches the search/browse context, but also allows more flexibility if, for example a top-level community
   * list is displayed in "title asc" order, but the RSS feed should default to an item list of "date desc" order.
   * If the SortOptions are null, incomplete or invalid, the pagination sortOptions will be used instead.
   */
  get rssSortOptions() {
    if (this.showRSS !== false && this.showRSS instanceof SortOptions
      && this.showRSS.direction !== null
      && this.showRSS.field !== null) {
      return this.showRSS;
    }
    return this.sortOptions;
  }

}
