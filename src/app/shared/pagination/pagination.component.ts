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

import { Subscription } from 'rxjs/Subscription';
import { isNumeric } from 'rxjs/util/isNumeric';

import { Observable } from 'rxjs/Observable';

import { HostWindowService } from '../host-window.service';
import { HostWindowState } from '../host-window.reducer';
import { PaginationComponentOptions } from './pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { hasNoValue, hasValue, isEmpty, isNotEmpty } from '../empty.util';
import { PageInfo } from '../../core/shared/page-info.model';

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
   * An event fired when the sort field is changed.
   * Event's payload equals to the newly selected sort field.
   */
  @Output() paginationChange: EventEmitter<any> = new EventEmitter<any>();

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
  public sortDirection: SortDirection = SortDirection.Ascending;

  /**
   * Name of the field that's used to sort by
   */
  public sortField = 'id';

  /**
   * Local variable, which can be used in the template to access the paginate controls ngbDropdown methods and properties
   */
  public paginationControls;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  /**
   * An object that represents pagination details of the current viewed page
   */
  public showingDetail: any = {
    range: null,
    total: null
  };

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
        if (isEmpty(queryParams)) {
          this.initializeConfig();
        } else {
          this.currentQueryParams = queryParams;
          const fixedProperties = this.validateParams(queryParams);
          if (isNotEmpty(fixedProperties)) {
            this.fixRoute(fixedProperties);
          }
          this.setFields();
          this.setShowingDetail();
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

  private initializeConfig() {
    // Set initial values
    this.id = this.paginationOptions.id || null;
    this.pageSizeOptions = this.paginationOptions.pageSizeOptions;
    this.currentPage = this.paginationOptions.currentPage;
    this.pageSize = this.paginationOptions.pageSize;
    this.sortDirection = this.sortOptions.direction;
    this.sortField = this.sortOptions.field;
    this.currentQueryParams = {
      page: this.currentPage,
      pageSize: this.pageSize,
      sortDirection: this.sortDirection,
      sortField: this.sortField
    };
    this.setShowingDetail();
  }

  /**
   * @param route
   *    Route is a singleton service provided by Angular.
   * @param router
   *    Router is a singleton service provided by Angular.
   */
  constructor(private cdRef: ChangeDetectorRef,
              private route: ActivatedRoute,
              private router: Router,
              public hostWindowService: HostWindowService) {
  }

  /**
   * Method to set set new page and update route parameters
   *
   * @param page
   *    The page being navigated to.
   */
  public doPageChange(page: number) {
    this.updateRoute({ page: page });
  }

  /**
   * Method to set set new page size and update route parameters
   *
   * @param pageSize
   *    The new page size.
   */
  public doPageSizeChange(pageSize: number) {
    this.updateRoute({ page: 1, pageSize: pageSize });
  }

  /**
   * Method to set set new sort direction and update route parameters
   *
   * @param sortDirection
   *    The new sort direction.
   */
  public doSortDirectionChange(sortDirection: SortDirection) {
    this.updateRoute({ page: 1, sortDirection: sortDirection });
  }

  /**
   * Method to set set new sort field and update route parameters
   *
   * @param sortField
   *    The new sort field.
   */
  public doSortFieldChange(field: string) {
    this.updateRoute({ page: 1, sortField: field });
  }

  /**
   * Method to set set new page and update route parameters
   *
   * @param page
   *    The page being navigated to.
   */
  public setPage(page: number) {
    this.currentPage = page;
    this.pageChange.emit(page);
    this.emitPaginationChange();
  }

  /**
   * Method to set set new page size and update route parameters
   *
   * @param pageSize
   *    The new page size.
   */
  public setPageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageSizeChange.emit(pageSize);
    this.emitPaginationChange();
  }

  /**
   * Method to set set new sort direction and update route parameters
   *
   * @param sortDirection
   *    The new sort direction.
   */
  public setSortDirection(sortDirection: SortDirection) {
    this.sortDirection = sortDirection;
    this.sortDirectionChange.emit(sortDirection);
    this.emitPaginationChange();
  }

  /**
   * Method to set set new sort field and update route parameters
   *
   * @param sortField
   *    The new sort field.
   */
  public setSortField(field: string) {
    this.sortField = field;
    this.sortFieldChange.emit(field);
    this.emitPaginationChange();
  }

  private emitPaginationChange() {
    this.paginationChange.emit({
      page: this.currentPage,
      pageSize: this.pageSize,
      sortDirection: this.sortDirection,
      sortField: this.sortField
    });
  }

  /**
   * Method to update the route parameters
   */
  private updateRoute(params: {}) {
    this.router.navigate([], {
      queryParams: Object.assign({}, this.currentQueryParams, params)
    });
  }

  /**
   * Method to set pagination details of the current viewed page.
   */
  private setShowingDetail() {
    let firstItem;
    let lastItem;
    const pageMax = this.pageSize * this.currentPage;

    firstItem = this.pageSize * (this.currentPage - 1) + 1;
    if (this.collectionSize > pageMax) {
      lastItem = pageMax;
    } else {
      lastItem = this.collectionSize;
    }
    this.showingDetail = {
      range: firstItem + ' - ' + lastItem,
      total: this.collectionSize
    }
  }

  /**
   * Validate query params
   *
   * @param page
   *    The page number to validate
   * @param pageSize
   *    The page size to validate
   */
  private validateParams(params: any): any {
    const validPage = this.validatePage(params.page);
    const filteredSize = this.validatePageSize(params.pageSize);
    const fixedFields: any = {};
    if (+params.page !== validPage) {
      fixedFields.page = validPage;
    }
    if (+params.pageSize !== filteredSize) {
      fixedFields.pageSize = filteredSize;
    }
    return fixedFields;
  }

  private setFields() {
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
    if (this.sortDirection !== +sortDirection) {
      this.setSortDirection(+sortDirection);
    }

    const sortField = this.currentQueryParams.sortField;
    if (this.sortField !== sortField) {
      this.setSortField(sortField);
    }
    this.cdRef.detectChanges();
  }

  private validatePage(page: any): number {
    let result = this.currentPage;
    if (isNumeric(page)) {
      result = +page;
    }
    return result;
  }

  private validatePageSize(pageSize: any): number {
    const filteredPageSize = this.pageSizeOptions.find((x) => x === +pageSize);
    let result = this.pageSize;
    if (filteredPageSize) {
      result = +pageSize;
    }
    return result;
  }

  /**
   * Ensure options passed contains the required properties.
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

  get hasMultiplePages(): boolean {
    return this.collectionSize > this.pageSize;
  }

  get shouldShowBottomPager(): boolean {
    return this.hasMultiplePages || !this.hidePagerWhenSinglePage
  }

}
