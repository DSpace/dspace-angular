import { Component, OnInit } from '@angular/core';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { SortOptions } from '../../../core/cache/models/sort-options.model';
import { NotificationsBrokerSourceObject } from '../../../core/notifications/broker/models/notifications-broker-source.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { NotificationsStateService } from '../../notifications-state.service';
import { AdminNotificationsBrokerSourcePageParams } from '../../../admin/admin-notifications/admin-notifications-broker-source-page-component/admin-notifications-broker-source-page-resolver.service';
import { hasValue } from '../../../shared/empty.util';

@Component({
  selector: 'ds-notifications-broker-source',
  templateUrl: './notifications-broker-source.component.html',
  styleUrls: ['./notifications-broker-source.component.scss']
})
export class NotificationsBrokerSourceComponent implements OnInit {

 /**
  * The pagination system configuration for HTML listing.
  * @type {PaginationComponentOptions}
  */
  public paginationConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'btp',
    pageSize: 10,
    pageSizeOptions: [5, 10, 20, 40, 60]
  });
  /**
   * The Notifications Broker source list sort options.
   * @type {SortOptions}
   */
  public paginationSortConfig: SortOptions;
  /**
   * The Notifications Broker source list.
   */
  public sources$: Observable<NotificationsBrokerSourceObject[]>;
  /**
   * The total number of Notifications Broker sources.
   */
  public totalElements$: Observable<number>;
  /**
   * Array to track all the component subscriptions. Useful to unsubscribe them with 'onDestroy'.
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  /**
   * Initialize the component variables.
   * @param {PaginationService} paginationService
   * @param {NotificationsStateService} notificationsStateService
   */
  constructor(
    private paginationService: PaginationService,
    private notificationsStateService: NotificationsStateService,
  ) { }

  /**
   * Component initialization.
   */
  ngOnInit(): void {
    this.sources$ = this.notificationsStateService.getNotificationsBrokerSource();
    this.totalElements$ = this.notificationsStateService.getNotificationsBrokerSourceTotals();
  }

  /**
   * First Notifications Broker source loading after view initialization.
   */
  ngAfterViewInit(): void {
    this.subs.push(
      this.notificationsStateService.isNotificationsBrokerSourceLoaded().pipe(
        take(1)
      ).subscribe(() => {
        this.getNotificationsBrokerSource();
      })
    );
  }

  /**
   * Returns the information about the loading status of the Notifications Broker source (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if the source are loading, 'false' otherwise.
   */
  public isSourceLoading(): Observable<boolean> {
    return this.notificationsStateService.isNotificationsBrokerSourceLoading();
  }

  /**
   * Returns the information about the processing status of the Notifications Broker source (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if there are operations running on the source (ex.: a REST call), 'false' otherwise.
   */
  public isSourceProcessing(): Observable<boolean> {
    return this.notificationsStateService.isNotificationsBrokerSourceProcessing();
  }

  /**
   * Dispatch the Notifications Broker source retrival.
   */
  public getNotificationsBrokerSource(): void {
    this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig).pipe(
      distinctUntilChanged(),
    ).subscribe((options: PaginationComponentOptions) => {
      this.notificationsStateService.dispatchRetrieveNotificationsBrokerSource(
        options.pageSize,
        options.currentPage
      );
    });
  }

  /**
   * Update pagination Config from route params
   *
   * @param eventsRouteParams
   */
  protected updatePaginationFromRouteParams(eventsRouteParams: AdminNotificationsBrokerSourcePageParams) {
    if (eventsRouteParams.currentPage) {
      this.paginationConfig.currentPage = eventsRouteParams.currentPage;
    }
    if (eventsRouteParams.pageSize) {
      if (this.paginationConfig.pageSizeOptions.includes(eventsRouteParams.pageSize)) {
        this.paginationConfig.pageSize = eventsRouteParams.pageSize;
      } else {
        this.paginationConfig.pageSize = this.paginationConfig.pageSizeOptions[0];
      }
    }
  }

  /**
   * Unsubscribe from all subscriptions.
   */
  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

}
