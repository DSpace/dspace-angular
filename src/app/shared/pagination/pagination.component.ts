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
import { isNumeric } from "rxjs/util/isNumeric";
import 'rxjs/add/operator/switchMap';
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import { HostWindowState } from "../host-window.reducer";
import { PaginationOptions } from '../../core/cache/models/pagination-options.model';

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
  @Input() paginationOptions: PaginationOptions;

  /**
   * An event fired when the page is changed.
   * Event's payload equals to the newly selected page.
   */
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  /**
   * An event fired when the page size is changed.
   * Event's payload equals to the newly selected page size.
   */
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Current page.
   */
  public currentPage = 1;

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
   * Number of items per page.
   */
  public pageSize: number = 10;

  /**
   * A number array that represents options for a context pagination limit.
   */
  private pageSizeOptions: Array<number>;

  /**
   * Local variable, which can be used in the template to access the paginate controls ngbDropdown methods and properties
   */
  public paginationControls;

  /**
   * Subscriber to observable.
   */
  private routeSubscription: any;

  /**
   * An object that represents pagination details of the current viewed page
   */
  public showingDetail: any = {
    range: null,
    total: null
  };

  /**
   * Subscriber to observable.
   */
  private stateSubscription: any;

  /**
   * Contains current HostWindowState
   */
  public windowBreakPoint: HostWindowState;

  /**
   * Method provided by Angular. Invoked after the constructor.
   */
  ngOnInit() {
    this.stateSubscription = this.hostWindow.subscribe((state: HostWindowState) => {
      this.windowBreakPoint = state;
    });
    this.checkConfig(this.paginationOptions);
    this.id = this.paginationOptions.id || null;
    this.currentPage = this.paginationOptions.currentPage;
    this.pageSize = this.paginationOptions.pageSize;
    this.pageSizeOptions = this.paginationOptions.pageSizeOptions;

    this.routeSubscription = this.route.params
      .map(params => params)
      .subscribe(params => {
        if(this.id == params['pageId']
           && (this.paginationOptions.currentPage != params['page']
           || this.paginationOptions.pageSize != params['pageSize'])
          ) {
          this.validateParams(params['page'], params['pageSize']);
        }
      });
    this.setShowingDetail();
  }

  /**
   * Method provided by Angular. Invoked when the instance is destroyed.
   */
  ngOnDestroy() {
    this.stateSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
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
    private store: Store<HostWindowState>
  ){
    this.hostWindow = this.store.select<HostWindowState>('hostWindow');
  }

  /**
   * Method to set set new page and update route parameters
   *
   * @param page
   *    The page being navigated to.
   */
  public doPageChange(page: number) {
    this.router.navigate([{ pageId: this.id, page: page, pageSize: this.pageSize }]);
    this.currentPage = page;
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
    this.router.navigate([{ pageId: this.id, page: this.currentPage, pageSize: pageSize }]);
    this.pageSize = pageSize;
    this.setShowingDetail();
    this.pageSizeChange.emit(pageSize);
  }

  /**
   * Method to set pagination details of the current viewed page.
   */
  private setShowingDetail() {
    let firstItem;
    let lastItem;
    let lastPage = Math.round(this.collectionSize / this.pageSize);

    firstItem = this.pageSize * (this.currentPage - 1) + 1;
    if (this.currentPage != lastPage) {
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
  private validateParams(page: any, pageSize: any) {
    let filteredPageSize = this.pageSizeOptions.find(x => x == pageSize);
    if (!isNumeric(page) || !filteredPageSize) {
      let filteredPage = isNumeric(page) ? page : this.currentPage;
      filteredPageSize = (filteredPageSize) ? filteredPageSize : this.pageSize;
      this.router.navigate([{ pageId: this.id, page: filteredPage, pageSize: filteredPageSize }]);
    } else {
      // (+) converts string to a number
      this.currentPage = +page;
      this.pageSize = +pageSize;
      this.pageChange.emit(this.currentPage);
      this.pageSizeChange.emit(this.pageSize);
    }
  }

  /**
   * Ensure options passed contains the required properties.
   *
   * @param paginateOptions
   *    The paginate options object.
   */
  private checkConfig(paginateOptions: any) {
    var required = ['id', 'currentPage', 'pageSize', 'pageSizeOptions'];
    var missing = required.filter(function (prop) { return !(prop in paginateOptions); });
    if (0 < missing.length) {
      throw new Error("Paginate: Argument is missing the following required properties: " + missing.join(', '));
    }
  }
}

