import { Component, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, take } from 'rxjs/operators';

import { SortOptions } from '../../../core/cache/models/sort-options.model';
import { NotificationsBrokerTopicObject } from '../../../core/notifications/broker/models/notifications-broker-topic.model';
import { hasValue } from '../../../shared/empty.util';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { NotificationsStateService } from '../../notifications-state.service';
import { AdminNotificationsBrokerTopicsPageParams } from '../../../admin/admin-notifications/admin-notifications-broker-topics-page/admin-notifications-broker-topics-page-resolver.service';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationsBrokerTopicsService } from './notifications-broker-topics.service';

/**
 * Component to display the Notifications Broker topic list.
 */
@Component({
  selector: 'ds-notifications-broker-topic',
  templateUrl: './notifications-broker-topics.component.html',
  styleUrls: ['./notifications-broker-topics.component.scss'],
})
export class NotificationsBrokerTopicsComponent implements OnInit {
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
   * The Notifications Broker topic list sort options.
   * @type {SortOptions}
   */
  public paginationSortConfig: SortOptions;
  /**
   * The Notifications Broker topic list.
   */
  public topics$: Observable<NotificationsBrokerTopicObject[]>;
  /**
   * The total number of Notifications Broker topics.
   */
  public totalElements$: Observable<number>;
  /**
   * Array to track all the component subscriptions. Useful to unsubscribe them with 'onDestroy'.
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  /**
   * This property represents a sourceId which is used to retrive a topic
   * @type {string}
   */
  public sourceId: string;

  /**
   * Initialize the component variables.
   * @param {PaginationService} paginationService
   * @param {NotificationsStateService} notificationsStateService
   */
  constructor(
    private paginationService: PaginationService,
    private activatedRoute: ActivatedRoute,
    private notificationsStateService: NotificationsStateService,
    private notificationsBrokerTopicsService: NotificationsBrokerTopicsService
  ) {
  }

  /**
   * Component initialization.
   */
  ngOnInit(): void {
    this.sourceId = this.activatedRoute.snapshot.paramMap.get('sourceId');
    this.notificationsBrokerTopicsService.setSourceId(this.sourceId);
    this.topics$ = this.notificationsStateService.getNotificationsBrokerTopics();
    this.totalElements$ = this.notificationsStateService.getNotificationsBrokerTopicsTotals();
  }

  /**
   * First Notifications Broker topics loading after view initialization.
   */
  ngAfterViewInit(): void {
    this.subs.push(
      this.notificationsStateService.isNotificationsBrokerTopicsLoaded().pipe(
        take(1)
      ).subscribe(() => {
        this.getNotificationsBrokerTopics();
      })
    );
  }

  /**
   * Returns the information about the loading status of the Notifications Broker topics (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if the topics are loading, 'false' otherwise.
   */
  public isTopicsLoading(): Observable<boolean> {
    return this.notificationsStateService.isNotificationsBrokerTopicsLoading();
  }

  /**
   * Returns the information about the processing status of the Notifications Broker topics (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if there are operations running on the topics (ex.: a REST call), 'false' otherwise.
   */
  public isTopicsProcessing(): Observable<boolean> {
    return this.notificationsStateService.isNotificationsBrokerTopicsProcessing();
  }

  /**
   * Dispatch the Notifications Broker topics retrival.
   */
  public getNotificationsBrokerTopics(): void {
    this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig).pipe(
      distinctUntilChanged(),
    ).subscribe((options: PaginationComponentOptions) => {
      this.notificationsStateService.dispatchRetrieveNotificationsBrokerTopics(
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
  protected updatePaginationFromRouteParams(eventsRouteParams: AdminNotificationsBrokerTopicsPageParams) {
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
