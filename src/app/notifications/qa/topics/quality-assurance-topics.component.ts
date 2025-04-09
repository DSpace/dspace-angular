import {
  AsyncPipe,
  DatePipe,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  Subscription,
} from 'rxjs';
import {
  distinctUntilChanged,
  map,
  take,
  tap,
} from 'rxjs/operators';

import { getNotificatioQualityAssuranceRoute } from '../../../admin/admin-routing-paths';
import { SortOptions } from '../../../core/cache/models/sort-options.model';
import { ItemDataService } from '../../../core/data/item-data.service';
import { QualityAssuranceTopicObject } from '../../../core/notifications/qa/models/quality-assurance-topic.model';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { Item } from '../../../core/shared/item.model';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '../../../core/shared/operators';
import { getItemPageRoute } from '../../../item-page/item-page-routing-paths';
import { QualityAssuranceTopicsPageParams } from '../../../quality-assurance-notifications-pages/quality-assurance-topics-page/quality-assurance-topics-page-resolver.service';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { hasValue } from '../../../shared/empty.util';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { NotificationsStateService } from '../../notifications-state.service';

/**
 * Component to display the Quality Assurance topic list.
 */
@Component({
  selector: 'ds-quality-assurance-topic',
  templateUrl: './quality-assurance-topics.component.html',
  styleUrls: ['./quality-assurance-topics.component.scss'],
  standalone: true,
  imports: [AlertComponent, NgIf, ThemedLoadingComponent, PaginationComponent, NgFor, RouterLink, AsyncPipe, TranslateModule, DatePipe],
})
export class QualityAssuranceTopicsComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   * The pagination system configuration for HTML listing.
   * @type {PaginationComponentOptions}
   */
  public paginationConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'btp',
    pageSize: 10,
    pageSizeOptions: [5, 10, 20, 40, 60],
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
   * This property represents a targetId (item-id) which is used to retrive a topic
   * @type {string}
   */
  public targetId: string;

  /**
   * The URL of the item page.
   */
  public itemPageUrl: string;

  /**
   * Initialize the component variables.
   * @param {PaginationService} paginationService
   * @param {ActivatedRoute} activatedRoute
   * @param itemService
   * @param {NotificationsStateService} notificationsStateService
   * @param router
   */
  constructor(
    private paginationService: PaginationService,
    private activatedRoute: ActivatedRoute,
    private itemService: ItemDataService,
    private notificationsStateService: NotificationsStateService,
    private router: Router,
  ) {
    this.sourceId = this.activatedRoute.snapshot.params.sourceId;
    this.targetId = this.activatedRoute.snapshot.params.targetId;
  }

  /**
   * Component initialization.
   */
  ngOnInit(): void {
    this.topics$ = this.notificationsStateService.getQualityAssuranceTopics().pipe(
      tap((topics: QualityAssuranceTopicObject[]) => {
        const forward = this.activatedRoute.snapshot.queryParams?.forward === 'true';
        if (topics.length === 1 && forward) {
          // If there is only one topic, navigate to the first topic automatically
          this.router.navigate([this.getQualityAssuranceRoute(), this.sourceId, topics[0].id]);
        }
      }),
    );
    this.totalElements$ = this.notificationsStateService.getQualityAssuranceTopicsTotals();
  }

  /**
   * First Quality Assurance topics loading after view initialization.
   */
  ngAfterViewInit(): void {
    this.subs.push(
      this.notificationsStateService.isQualityAssuranceTopicsLoaded().pipe(
        take(1),
      ).subscribe(() => {
        this.getQualityAssuranceTopics(this.sourceId, this.targetId);
      }),
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
  public getQualityAssuranceTopics(source: string, target?: string): void {
    this.subs.push(this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig).pipe(
      distinctUntilChanged(),
    ).subscribe((options: PaginationComponentOptions) => {
      this.notificationsStateService.dispatchRetrieveQualityAssuranceTopics(
        options.pageSize,
        options.currentPage,
        source,
        target,
      );
    }));
  }

  /**
   * Update pagination Config from route params
   *
   * @param eventsRouteParams
   */
  protected updatePaginationFromRouteParams(eventsRouteParams: QualityAssuranceTopicsPageParams) {
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
   * Returns an Observable that emits the title of the target item.
   * The target item is retrieved by its ID using the itemService.
   * The title is extracted from the first metadata value of the item.
   * The item page URL is also set in the component.
   * @returns An Observable that emits the title of the target item.
   */
  getTargetItemTitle(): Observable<string> {
    return this.itemService.findById(this.targetId).pipe(
      take(1),
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      tap((item: Item) => this.itemPageUrl = getItemPageRoute(item)),
      map((item: Item) => item.firstMetadataValue('dc.title')),
    );
  }

  /**
   * Returns the page route for the given item.
   * @param item The item to get the page route for.
   * @returns The page route for the given item.
   */
  getItemPageRoute(item: Item): string {
    return getItemPageRoute(item);
  }

  /**
   * Returns the quality assurance route.
   * @returns The quality assurance route.
   */
  getQualityAssuranceRoute(): string {
    return getNotificatioQualityAssuranceRoute();
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
