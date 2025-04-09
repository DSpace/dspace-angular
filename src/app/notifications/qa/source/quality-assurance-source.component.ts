import {
  AsyncPipe,
  DatePipe,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  Subscription,
} from 'rxjs';
import {
  distinctUntilChanged,
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

/**
 * Component to display the Quality Assurance source list.
 */
@Component({
  selector: 'ds-quality-assurance-source',
  templateUrl: './quality-assurance-source.component.html',
  styleUrls: ['./quality-assurance-source.component.scss'],
  standalone: true,
  imports: [AlertComponent, NgIf, ThemedLoadingComponent, PaginationComponent, NgFor, RouterLink, AsyncPipe, TranslateModule, DatePipe],
})
export class QualityAssuranceSourceComponent implements OnInit {

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
  public sources$: Observable<QualityAssuranceSourceObject[]>;
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
   */
  constructor(
    private paginationService: PaginationService,
    private notificationsStateService: NotificationsStateService,
  ) {
  }

  /**
   * Component initialization.
   */
  ngOnInit(): void {
    this.sources$ = this.notificationsStateService.getQualityAssuranceSource();
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
   * Dispatch the Quality Assurance source retrival.
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
