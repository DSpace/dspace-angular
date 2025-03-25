import {
  AsyncPipe,
  DatePipe,
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
} from 'rxjs/operators';

import { SortOptions } from '../../../core/cache/models/sort-options.model';
import { QualityAssuranceSourceObject } from '../../../core/notifications/qa/models/quality-assurance-source.model';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { QualityAssuranceSourcePageParams } from '../../../quality-assurance-notifications-pages/quality-assurance-source-page-component/quality-assurance-source-page-resolver.service';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { hasValue } from '../../../shared/empty.util';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { NotificationsStateService } from '../../notifications-state.service';
import {
  SourceListComponent,
  SourceObject,
} from '../../shared/source-list.component';

/**
 * Component to display the Quality Assurance source list.
 */
@Component({
  selector: 'ds-quality-assurance-source',
  templateUrl: './quality-assurance-source.component.html',
  styleUrls: ['./quality-assurance-source.component.scss'],
  standalone: true,
  imports: [AlertComponent, ThemedLoadingComponent, PaginationComponent, RouterLink, AsyncPipe, TranslateModule, DatePipe, SourceListComponent],
})
export class QualityAssuranceSourceComponent implements OnDestroy, OnInit, AfterViewInit {

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
   * The Quality Assurance source list sort options.
   * @type {SortOptions}
   */
  public paginationSortConfig: SortOptions;
  /**
   * The Quality Assurance source list.
   */
  public sources$: Observable<SourceObject[]>;
  /**
   * The total number of Quality Assurance sources.
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
   * @param {Router} router
   * @param {ActivatedRoute} route
   */
  constructor(
    private paginationService: PaginationService,
    private notificationsStateService: NotificationsStateService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  /**
   * Component initialization.
   */
  ngOnInit(): void {
    this.sources$ = this.notificationsStateService.getQualityAssuranceSource().pipe(
      map((sources: QualityAssuranceSourceObject[])=> {
        return sources.map((source: QualityAssuranceSourceObject) => ({
          id: source.id,
          lastEvent: source.lastEvent,
          total: source.totalEvents,
        }));
      }),
    );
    this.totalElements$ = this.notificationsStateService.getQualityAssuranceSourceTotals();
  }

  /**
   * First Quality Assurance source loading after view initialization.
   */
  ngAfterViewInit(): void {
    this.subs.push(
      this.notificationsStateService.isQualityAssuranceSourceLoaded().pipe(
        take(1),
      ).subscribe(() => {
        this.getQualityAssuranceSource();
      }),
    );
  }

  /**
   * Navigate to the specified source
   * @param sourceId
   */
  onSelect(sourceId: string) {
    this.router.navigate([sourceId], { relativeTo: this.route });
  }

  /**
   * Returns the information about the loading status of the Quality Assurance source (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if the source are loading, 'false' otherwise.
   */
  public isSourceLoading(): Observable<boolean> {
    return this.notificationsStateService.isQualityAssuranceSourceLoading();
  }

  /**
   * Returns the information about the processing status of the Quality Assurance source (if it's running or not).
   *
   * @return Observable<boolean>
   *    'true' if there are operations running on the source (ex.: a REST call), 'false' otherwise.
   */
  public isSourceProcessing(): Observable<boolean> {
    return this.notificationsStateService.isQualityAssuranceSourceProcessing();
  }

  /**
   * Dispatch the Quality Assurance source retrieval.
   */
  public getQualityAssuranceSource(): void {
    this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig).pipe(
      distinctUntilChanged(),
    ).subscribe((options: PaginationComponentOptions) => {
      this.notificationsStateService.dispatchRetrieveQualityAssuranceSource(
        options.pageSize,
        options.currentPage,
      );
    });
  }

  /**
   * Update pagination Config from route params
   *
   * @param eventsRouteParams
   */
  protected updatePaginationFromRouteParams(eventsRouteParams: QualityAssuranceSourcePageParams) {
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
