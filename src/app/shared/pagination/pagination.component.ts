
import {
  ChangeDetectionStrategy,
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
import { hasValue } from '../empty.util';

/**
 * The default pagination controls component.
 */
@Component({
  exportAs: 'paginationComponent',
  selector: 'ds-pagination',
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
  public currentPage = 1;

  /**
   * Current URL query parameters
   */
  public currentQueryParams = {};

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
  public pageSize = 10;

  /**
   * Declare SortDirection enumeration to use it in the template
   */
  public sortDirections = SortDirection

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
      }));
    this.checkConfig(this.paginationOptions);
    this.id = this.paginationOptions.id || null;
    this.currentPage = this.paginationOptions.currentPage;
    this.pageSize = this.paginationOptions.pageSize;
    this.pageSizeOptions = this.paginationOptions.pageSizeOptions;
    this.sortDirection = this.sortOptions.direction;
    this.sortField = this.sortOptions.field;
    this.subs.push(this.route.queryParams
      .filter((queryParams) => hasValue(queryParams))
      .subscribe((queryParams) => {
        this.currentQueryParams = queryParams;
        // tslint:disable:triple-equals
        if (this.id == queryParams.pageId
          && (this.paginationOptions.currentPage != queryParams.page
            || this.paginationOptions.pageSize != queryParams.pageSize
            || this.sortOptions.direction !== queryParams.sortDirection
            || this.sortOptions.field !== queryParams.sortField)
        ) {
          this.validateParams(queryParams.page, queryParams.pageSize, queryParams.sortDirection, queryParams.sortField);
        }
        // tslint:enable:triple-equals
      }));
    this.setShowingDetail();
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
   * @param route
   *    Route is a singleton service provided by Angular.
   * @param router
   *    Router is a singleton service provided by Angular.
   */
  constructor(
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
    this.currentPage = page;
    this.updateRoute();
    this.setShowingDetail();
    this.pageChange.emit(page);
  }

  /**
   * Method to set set new page size and update route parameters
   *
   * @param pageSize
   *    The new page size.
   */
  public setPageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.updateRoute();
    this.setShowingDetail();
    this.pageSizeChange.emit(pageSize);
  }

  /**
   * Method to set set new sort direction and update route parameters
   *
   * @param sortDirection
   *    The new sort direction.
   */
  public setSortDirection(sortDirection: SortDirection) {
    this.sortDirection = sortDirection;
    this.updateRoute();
    this.setShowingDetail();
    this.sortDirectionChange.emit(sortDirection);
  }

  /**
   * Method to set set new sort field and update route parameters
   *
   * @param sortField
   *    The new sort field.
   */
  public setSortField(field: string) {
    this.sortField = field;
    this.updateRoute();
    this.setShowingDetail();
    this.sortFieldChange.emit(field);
  }

  /**
   * Method to update the route parameters
   */
  private updateRoute() {
    this.router.navigate([], {
      queryParams: Object.assign({}, this.currentQueryParams, {
        pageId: this.id,
        page: this.currentPage,
        pageSize: this.pageSize,
        sortDirection: this.sortDirection,
        sortField: this.sortField
      })
    });
  }

  /**
   * Method to set pagination details of the current viewed page.
   */
  private setShowingDetail() {
    let firstItem;
    let lastItem;
    const lastPage = Math.round(this.collectionSize / this.pageSize);

    firstItem = this.pageSize * (this.currentPage - 1) + 1;
    if (this.currentPage !== lastPage) {
      lastItem = this.pageSize * this.currentPage;
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
  private validateParams(page: any, pageSize: any, sortDirection: any, sortField: any) {
    // tslint:disable-next-line:triple-equals
    let filteredPageSize = this.pageSizeOptions.find((x) => x == pageSize);
    if (!isNumeric(page) || !filteredPageSize) {
      const filteredPage = isNumeric(page) ? page : this.currentPage;
      filteredPageSize = (filteredPageSize) ? filteredPageSize : this.pageSize;
      this.router.navigate([], {
        queryParams: {
          pageId: this.id,
          page: filteredPage,
          pageSize: filteredPageSize,
          sortDirection: sortDirection,
          sortField: sortField
        }
      }
      );
    } else {
      // (+) converts string to a number
      this.currentPage = +page;
      this.pageSize = +pageSize;
      this.sortDirection = +sortDirection;
      this.sortField = sortField;
      this.pageChange.emit(this.currentPage);
      this.pageSizeChange.emit(this.pageSize);
      this.sortDirectionChange.emit(this.sortDirection);
      this.sortFieldChange.emit(this.sortField);
    }
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
