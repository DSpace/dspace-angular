import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, Observable } from 'rxjs';
import { isNumeric } from 'rxjs/internal-compatibility';
import { isEqual, isObject, transform } from 'lodash';

import { HostWindowService } from '../host-window.service';
import { HostWindowState } from '../search/host-window.reducer';
import { PaginationComponentOptions } from './pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { hasValue, isNotEmpty } from '../empty.util';
import { PageInfo } from '../../core/shared/page-info.model';
import { difference } from '../object.util';

/**
 * The default pagination controls component.
 */
@Component({
  exportAs: 'paginationComponent',
  selector: 'ds-pagination',
  styleUrls: ['pagination.component.scss'],
  templateUrl: 'pagination.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated
})
export class PaginationComponent implements OnDestroy, OnInit {
  /**
   * Number of items in collection.
   */
  @Input() collectionSize: number;

  /**
   * Page state of a Remote paginated objects.
   */
  @Input() pageInfoState: Observable<PageInfo> = undefined;

  /**
   * Configuration for the NgbPagination component.
   */
  @Input() paginationOptions: PaginationComponentOptions;

  /**
   * Sort configuration for this component.
   */
  @Input() sortOptions: SortOptions;

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
   * Option for hiding the pager when there is less than 2 pages
   */
  @Input() public hidePagerWhenSinglePage = true;

  /**
   * Current page.
   */
  public currentPage;

  /**
   * Current page in the state of a Remote paginated objects.
   */
  public currentPageState: number = undefined;

  /**
   * Current URL query parameters
   */
  public currentQueryParams: any;

  /**
   * An observable of HostWindowState type
   */
  public hostWindow: Observable<HostWindowState>;

  /**
   * ID for the pagination instance. Only useful if you wish to
   * have more than once instance at a time in a given component.
   */
  private id: string;

  /**
   * A boolean that indicate if is an extra small devices viewport.
   */
  public isXs: boolean;

  /**
   * Number of items per page.
   */
  public pageSize;

  /**
   * Declare SortDirection enumeration to use it in the template
   */
  public sortDirections = SortDirection;

  /**
   * A number array that represents options for a context pagination limit.
   */
  private pageSizeOptions: number[];

  /**
   * Direction in which to sort: ascending or descending
   */
  public sortDirection: SortDirection = SortDirection.ASC;

  /**
   * Name of the field that's used to sort by
   */
  public sortField = 'id';

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

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
    // Listen to changes
    this.subs.push(this.route.queryParams
      .subscribe((queryParams) => {
        if (this.isEmptyPaginationParams(queryParams)) {
          this.initializeConfig(queryParams);
        } else {
          this.currentQueryParams = queryParams;
          const fixedProperties = this.validateParams(queryParams);
          if (isNotEmpty(fixedProperties)) {
            this.fixRoute(fixedProperties);
          } else {
            this.setFields();
          }
        }
      }));
  }

  private fixRoute(fixedProperties) {
    this.updateRoute(fixedProperties);
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
  private initializeConfig(queryParams: any = {}) {
    // Set initial values
    this.id = this.paginationOptions.id || null;
    this.pageSizeOptions = this.paginationOptions.pageSizeOptions;
    this.currentPage = this.paginationOptions.currentPage;
    this.pageSize = this.paginationOptions.pageSize;
    if (this.sortOptions) {
      this.sortDirection = this.sortOptions.direction;
      this.sortField = this.sortOptions.field;
    }
    this.currentQueryParams = Object.assign({}, queryParams, {
      pageId: this.id,
      page: this.currentPage,
      pageSize: this.pageSize,
      sortDirection: this.sortDirection,
      sortField: this.sortField
    });
  }

  /**
   * @param cdRef
   *    ChangeDetectorRef is a singleton service provided by Angular.
   * @param route
   *    Route is a singleton service provided by Angular.
   * @param router
   *    Router is a singleton service provided by Angular.
   * @param hostWindowService
   *    the HostWindowService singleton.
   */
  constructor(private cdRef: ChangeDetectorRef,
              private route: ActivatedRoute,
              private router: Router,
              public hostWindowService: HostWindowService) {
  }

  /**
   * Method to change the route to the given page
   *
   * @param page
   *    The page being navigated to.
   */
  public doPageChange(page: number) {
    this.updateRoute({ pageId: this.id, page: page.toString() });
  }

  /**
   * Method to change the route to the given page size
   *
   * @param pageSize
   *    The page size being navigated to.
   */
  public doPageSizeChange(pageSize: number) {
    this.updateRoute({ pageId: this.id, page: 1, pageSize: pageSize });
  }

  /**
   * Method to change the route to the given sort direction
   *
   * @param sortDirection
   *    The sort direction being navigated to.
   */
  public doSortDirectionChange(sortDirection: SortDirection) {
    this.updateRoute({ pageId: this.id, page: 1, sortDirection: sortDirection });
  }

  /**
   * Method to change the route to the given sort field
   *
   * @param sortField
   *    The sort field being navigated to.
   */
  public doSortFieldChange(field: string) {
    this.updateRoute({ pageId: this.id, page: 1, sortField: field });
  }

  /**
   * Method to set the current page and trigger page change events
   *
   * @param page
   *    The new page value
   */
  public setPage(page: number) {
    this.currentPage = page;
    this.pageChange.emit(page);
    this.emitPaginationChange();
  }

  /**
   * Method to set the current page size and trigger page size change events
   *
   * @param pageSize
   *    The new page size value.
   */
  public setPageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageSizeChange.emit(pageSize);
    this.emitPaginationChange();
  }

  /**
   * Method to set the current sort direction and trigger sort direction change events
   *
   * @param sortDirection
   *    The new sort directionvalue.
   */
  public setSortDirection(sortDirection: SortDirection) {
    this.sortDirection = sortDirection;
    this.sortDirectionChange.emit(sortDirection);
    this.emitPaginationChange();
  }

  /**
   * Method to set the current sort field and trigger sort field change events
   *
   * @param sortField
   *    The new sort field.
   */
  public setSortField(field: string) {
    this.sortField = field;
    this.sortFieldChange.emit(field);
    this.emitPaginationChange();
  }

  /**
   * Method to emit a general pagination change event
   */
  private emitPaginationChange() {
    this.paginationChange.emit(
      {
        pagination: Object.assign(
          new PaginationComponentOptions(),
          {
            id: this.id,
            currentPage: this.currentPage,
            pageSize: this.pageSize,
          }),
        sort: Object.assign(
          new SortOptions(this.sortField, this.sortDirection)
        )
      })
  }

  /**
   * Method to update the route parameters
   */
  private updateRoute(params: {}) {
    if (isNotEmpty(difference(params, this.currentQueryParams))) {
      this.router.navigate([], {
        queryParams: Object.assign({}, this.currentQueryParams, params),
        queryParamsHandling: 'merge'
      });
    }
  }

  private difference(object, base) {
    const changes = (o, b) => {
      return transform(o, (result, value, key) => {
        if (!isEqual(value, b[key]) && isNotEmpty(value)) {
          result[key] = (isObject(value) && isObject(b[key])) ? changes(value, b[key]) : value;
        }
      });
    };
    return changes(object, base);
  }

  /**
   * Method to get pagination details of the current viewed page.
   */
  public getShowingDetails(collectionSize: number): any {
    let showingDetails = { range: null + ' - ' + null, total: null };
    if (collectionSize) {
      let firstItem;
      let lastItem;
      const pageMax = this.pageSize * this.currentPage;

      firstItem = this.pageSize * (this.currentPage - 1) + 1;
      if (collectionSize > pageMax) {
        lastItem = pageMax;
      } else {
        lastItem = collectionSize;
      }
      showingDetails = { range: firstItem + ' - ' + lastItem, total: collectionSize };
    }
    return showingDetails;
  }

  /**
   * Method to validate query params
   *
   * @param page
   *    The page number to validate
   * @param pageSize
   *    The page size to validate
   * @returns valid parameters if initial parameters were invalid
   */
  private validateParams(params: any): any {
    const validPage = this.validatePage(params.page);
    const filteredSize = this.validatePageSize(params.pageSize);
    const fixedFields: any = {};
    if (+params.page !== validPage) {
      fixedFields.page = validPage.toString();
    }
    if (+params.pageSize !== filteredSize) {
      fixedFields.pageSize = filteredSize.toString();
    }
    return fixedFields;
  }

  /**
   * Method to update all pagination variables to the current query parameters
   */
  private setFields() {
    // set fields only when page id is the one configured for this pagination instance
    if (this.currentQueryParams.pageId === this.id) {
      // (+) converts string to a number
      const page = this.currentQueryParams.page;
      if (this.currentPage !== +page) {
        this.setPage(+page);
      }

      const pageSize = this.currentQueryParams.pageSize;
      if (this.pageSize !== +pageSize) {
        this.setPageSize(+pageSize);
      }

      const sortDirection = this.currentQueryParams.sortDirection;
      if (this.sortDirection !== sortDirection) {
        this.setSortDirection(sortDirection);
      }

      const sortField = this.currentQueryParams.sortField;
      if (this.sortField !== sortField) {
        this.setSortField(sortField);
      }
      this.cdRef.detectChanges();
    }
  }

  /**
   * Method to validate the current page value
   *
   * @param page
   *    The page number to validate
   * @returns returns valid page value
   */
  private validatePage(page: any): number {
    let result = this.currentPage;
    if (isNumeric(page)) {
      result = +page;
    }
    return result;
  }

  /**
   * Method to validate the current page size value
   *
   * @param page size
   *    The page size to validate
   * @returns returns valid page size value
   */
  private validatePageSize(pageSize: any): number {
    const filteredPageSize = this.pageSizeOptions.find((x) => x === +pageSize);
    let result = this.pageSize;
    if (filteredPageSize) {
      result = +pageSize;
    }
    return result;
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
   * Method to check if none of the query params necessary for pagination are filled out.
   *
   * @param paginateOptions
   *    The paginate options object.
   */
  private isEmptyPaginationParams(paginateOptions): boolean {
    const properties = ['id', 'currentPage', 'pageSize', 'pageSizeOptions'];
    const missing = properties.filter((prop) => {
      return !(prop in paginateOptions);
    });

    return properties.length === missing.length;
  }

  /**
   * Property to check whether the current pagination object has multiple pages
   * @returns true if there are multiple pages, else returns false
   */
  get hasMultiplePages(): boolean {
    return this.collectionSize > this.pageSize;
  }

  /**
   * Property to check whether the current pagination should show a bottom pages
   * @returns true if a bottom pages should be shown, else returns false
   */
  get shouldShowBottomPager(): boolean {
    return this.hasMultiplePages || !this.hidePagerWhenSinglePage
  }
}
