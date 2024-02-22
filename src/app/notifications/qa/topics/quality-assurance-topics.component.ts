import { Component, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, take } from 'rxjs/operators';

import { SortOptions } from '../../../core/cache/models/sort-options.model';
import {
  QualityAssuranceTopicObject
} from '../../../core/notifications/qa/models/quality-assurance-topic.model';
import { hasValue } from '../../../shared/empty.util';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { NotificationsStateService } from '../../notifications-state.service';
import {
  AdminQualityAssuranceTopicsPageParams
} from '../../../admin/admin-notifications/admin-quality-assurance-topics-page/admin-quality-assurance-topics-page-resolver.service';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { ActivatedRoute } from '@angular/router';
import { QualityAssuranceTopicsService } from './quality-assurance-topics.service';

/**
 * Component to display the Quality Assurance topic list.
 */
@Component({
  selector: 'ds-quality-assurance-topic',
  templateUrl: './quality-assurance-topics.component.html',
  styleUrls: ['./quality-assurance-topics.component.scss'],
})
export class QualityAssuranceTopicsComponent implements OnInit {
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
   * The Quality Assurance topic list sort options.
   * @type {SortOptions}
   */
  public paginationSortConfig: SortOptions;
  /**
   * The Quality Assurance topic list.
   */
  public topics$: Observable<QualityAssuranceTopicObject[]>;
  /**
   * The total number of Quality Assurance topics.
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
   * @param {ActivatedRoute} activatedRoute
   * @param {NotificationsStateService} notificationsStateService
   * @param {QualityAssuranceTopicsService} qualityAssuranceTopicsService
   */
  constructor(
    private paginationService: PaginationService,
    private activatedRoute: ActivatedRoute,
    private notificationsStateService: NotificationsStateService,
    private qualityAssuranceTopicsService: QualityAssuranceTopicsService
  ) {
  }

  /**
   * Component initialization.
   */
  ngOnInit(): void {
    this.sourceId = this.activatedRoute.snapshot.paramMap.get('sourceId');
    this.qualityAssuranceTopicsService.setSourceId(this.sourceId);
    this.topics$ = this.notificationsStateService.getQualityAssuranceTopics();
    this.totalElements$ = this.notificationsStateService.getQualityAssuranceTopicsTotals();
  }

  /**
   * First Quality Assurance topics loading after view initialization.
   */
  ngAfterViewInit(): void {
    this.subs.push(
      this.notificationsStateService.isQualityAssuranceTopicsLoaded().pipe(
        take(1)
      ).subscribe(() => {
        this.getQualityAssuranceTopics();
      })
    );
  }

  /**
   * Returns the information about the loading status of the Quality Assurance topics (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if the topics are loading, 'false' otherwise.
   */
  public isTopicsLoading(): Observable<boolean> {
    return this.notificationsStateService.isQualityAssuranceTopicsLoading();
  }

  /**
   * Returns the information about the processing status of the Quality Assurance topics (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if there are operations running on the topics (ex.: a REST call), 'false' otherwise.
   */
  public isTopicsProcessing(): Observable<boolean> {
    return this.notificationsStateService.isQualityAssuranceTopicsProcessing();
  }

  /**
   * Dispatch the Quality Assurance topics retrival.
   */
  public getQualityAssuranceTopics(): void {
    this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig).pipe(
      distinctUntilChanged(),
    ).subscribe((options: PaginationComponentOptions) => {
      this.notificationsStateService.dispatchRetrieveQualityAssuranceTopics(
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
  protected updatePaginationFromRouteParams(eventsRouteParams: AdminQualityAssuranceTopicsPageParams) {
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
