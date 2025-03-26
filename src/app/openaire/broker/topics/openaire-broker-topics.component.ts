import { Component, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, take } from 'rxjs/operators';

import { SortOptions } from '../../../core/cache/models/sort-options.model';
import { OpenaireBrokerTopicObject } from '../../../core/openaire/broker/models/openaire-broker-topic.model';
import { hasValue } from '../../../shared/empty.util';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { OpenaireStateService } from '../../openaire-state.service';
import { AdminNotificationsOpenaireTopicsPageParams } from '../../../admin/admin-notifications/admin-notifications-openaire-topics-page/admin-notifications-openaire-topics-page-resolver.service';
import { PaginationService } from '../../../core/pagination/pagination.service';

/**
 * Component to display the OpenAIRE Broker topic list.
 */
@Component({
  selector: 'ds-openaire-broker-topic',
  templateUrl: './openaire-broker-topics.component.html',
  styleUrls: ['./openaire-broker-topics.component.scss'],
})
export class OpenaireBrokerTopicsComponent implements OnInit {
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
   * The OpenAIRE Broker topic list sort options.
   * @type {SortOptions}
   */
  public paginationSortConfig: SortOptions;
  /**
   * The OpenAIRE Broker topic list.
   */
  public topics$: Observable<OpenaireBrokerTopicObject[]>;
  /**
   * The total number of OpenAIRE Broker topics.
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
   * @param {OpenaireStateService} openaireStateService
   */
  constructor(
    private paginationService: PaginationService,
    private openaireStateService: OpenaireStateService,
  ) { }

  /**
   * Component initialization.
   */
  ngOnInit(): void {
    this.topics$ = this.openaireStateService.getOpenaireBrokerTopics();
    this.totalElements$ = this.openaireStateService.getOpenaireBrokerTopicsTotals();
  }

  /**
   * First OpenAIRE Broker topics loading after view initialization.
   */
  ngAfterViewInit(): void {
    this.subs.push(
      this.openaireStateService.isOpenaireBrokerTopicsLoaded().pipe(
        take(1)
      ).subscribe(() => {
        this.getOpenaireBrokerTopics();
      })
    );
  }

  /**
   * Returns the information about the loading status of the OpenAIRE Broker topics (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if the topics are loading, 'false' otherwise.
   */
  public isTopicsLoading(): Observable<boolean> {
    return this.openaireStateService.isOpenaireBrokerTopicsLoading();
  }

  /**
   * Returns the information about the processing status of the OpenAIRE Broker topics (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if there are operations running on the topics (ex.: a REST call), 'false' otherwise.
   */
  public isTopicsProcessing(): Observable<boolean> {
    return this.openaireStateService.isOpenaireBrokerTopicsProcessing();
  }

  /**
   * Dispatch the OpenAIRE Broker topics retrival.
   */
  public getOpenaireBrokerTopics(): void {
    this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig).pipe(
      distinctUntilChanged(),
    ).subscribe((options: PaginationComponentOptions) => {
      this.openaireStateService.dispatchRetrieveOpenaireBrokerTopics(
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
  protected updatePaginationFromRouteParams(eventsRouteParams: AdminNotificationsOpenaireTopicsPageParams) {
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
