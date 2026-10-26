import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { StatisticsCategory } from '@dspace/core/statistics/models/statistics-category.model';
import {
  CleanCategoryReportAction,
  SetCategoryReportAction,
} from '@dspace/core/statistics/statistics.action';
import { StatisticsCategoriesDataService } from '@dspace/core/statistics/statistics-categories-data.service';
import {
  getCategoryId,
  getReportId,
} from '@dspace/core/statistics/statistics-selector';
import {
  NgbDate,
  NgbDateParserFormatter,
  NgbDatepickerModule,
  NgbDateStruct,
  NgbNav,
  NgbNavContent,
  NgbNavItem,
  NgbNavLink,
} from '@ng-bootstrap/ng-bootstrap';
import {
  select,
  Store,
} from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
} from 'rxjs';
import {
  finalize,
  map,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { AppState } from '../../app.reducer';
import { AuthService } from '../../core/auth/auth.service';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { SiteDataService } from '../../core/data/site-data.service';
import { redirectOn4xx } from '../../core/shared/authorized.operators';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getRemoteDataPayload,
} from '../../core/shared/operators';
import { UsageReport } from '../../core/statistics/models/usage-report.model';
import { UsageReportDataService } from '../../core/statistics/usage-report-data.service';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { VarDirective } from '../../shared/utils/var.directive';
import { StatisticsChartComponent } from './statistics-chart/statistics-chart.component';
import { StatisticsMapComponent } from './statistics-map/statistics-map.component';
import { FilterMapPipe } from './statistics-pipes/filter-map.pipe';

@Component({
  selector: 'ds-cris-statistics-page',
  templateUrl: './cris-statistics-page.component.html',
  styleUrls: ['./cris-statistics-page.component.scss'],
  imports: [
    AsyncPipe,
    FilterMapPipe,
    FormsModule,
    NgbDatepickerModule,
    NgbNav,
    NgbNavContent,
    NgbNavItem,
    NgbNavLink,
    StatisticsChartComponent,
    StatisticsMapComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class CrisStatisticsPageComponent implements OnInit, OnDestroy {

  private currentReportId: string | null = null;
  private fullReportCache = new Map<string, UsageReport>();
  private inFlightRequests = new Map<string, Observable<UsageReport>>();

  /**
   * The scope dso for this statistics page, as an Observable.
   */
  scope$: Observable<DSpaceObject>;

  /**
   * The report types to show on this statistics page.
   */
  @Input() types: string[];

  /**
   * The usage report types to show on this statistics page, as an Observable list.
   */
  reports$: Observable<any[]>;

  /**
   * The statistics categories to show on this statistics page, as an Observable list.
   */
  categories$: Observable<StatisticsCategory[]>;

  /**
   * List of categories, utilized when tab is selected.
   */
  categorieList: StatisticsCategory[];

  /**
   * The selected category that will be changed from tabs
   */
  selectedCategory: StatisticsCategory;

  /**
   * The category type
   */
  categoryType: string;

  /**
   * The date from to filter
   */
  dateFrom: NgbDateStruct;

  /**
   * The date from to filter
   */
  dateTo: NgbDateStruct;

  /**
   * This property holds a selected report id
   */
  selectedReportId: string;

  /**
   * The fully loaded report (with points) for the currently selected chart report.
   */
  protected selectedFullReport$ = new BehaviorSubject<UsageReport | null>(null);

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected usageReportService: UsageReportDataService,
    protected statisticsCategoriesService: StatisticsCategoriesDataService,
    protected nameService: DSONameService,
    protected authService: AuthService,
    protected siteService: SiteDataService,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private store: Store<AppState>,
  ) {
  }

  /**
   * Get the scope from site or from dso.
   */
  ngOnInit(): void {
    this.route.data.subscribe((res) => {
      if ( res.type === 'site' ) {
        this.scope$ = this.getSiteScope$();
      } else {
        this.scope$ = this.getScope$();
      }
      this.categories$ = this.getCategories$();
    });
  }

  /**
   * Get the scope from site.
   */
  public getSiteScope$() {
    return this.siteService.find();
  }

  /**
   * Get the scope dso for this statistics page, as an Observable.
   */
  public getScope$(): Observable<DSpaceObject> {
    return this.route.data.pipe(
      map((data: any) => data.scope as RemoteData<any>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
    );
  }

  /**
   * Get the categories for this statistics page, as an Observable list
   */
  public getCategories$(): Observable<StatisticsCategory[]> {
    return this.scope$.pipe(
      switchMap((scope) => {
        return this.statisticsCategoriesService.getCategoriesStatistics(scope._links.self.href,0,50,this.parseDate(this.dateFrom),this.parseDate(this.dateTo));
      }),
      map((resultRD: RemoteData<PaginatedList<StatisticsCategory>>) => {
        return resultRD.hasSucceeded ? resultRD.payload.page : [];
      }),
      tap((categories: StatisticsCategory[]) => {
        this.categorieList = categories;
        this.getCategoryId().subscribe((categoryId) => {
          if (categoryId) {
            this.selectedCategory = this.categorieList.find((cat) => {
              return cat.id === categoryId;
            });
            this.categoryType = this.selectedCategory?.categoryType;
          } else {
            this.selectedCategory = categories.length > 0 && categories[0] || null;
            this.categoryType = this.selectedCategory?.categoryType;
          }
          this.getUserReports(this.selectedCategory);
        });
      }),
    );
  }

  /**
   * Get the name of the scope dso.
   * @param scope the scope dso to get the name for
   */
  getName(scope: DSpaceObject): string {
    return this.nameService.getName(scope);
  }

  /**
   * When tab changed ,need to refresh information.
   * @param event the that is being selected
   */
  changeCategoryType(event) {
    const category = this.categorieList.find((cat) => { return cat.id === event.nextId; });
    this.selectedCategory = category;
    this.categoryType = this.selectedCategory.categoryType;
    this.getReportId().subscribe((reportId) => {
      this.setStatisticsState(reportId, category.id);
      this.getUserReports(category);
    });
  }

  /**
   * Get the user reports for the specific category.
   * @param category the that is being selected
   * @param reportType
   */
  getUserReports(category, reportType = this.route?.snapshot?.queryParams?.reportType) {
    this.selectedFullReport$.next(null);
    this.reports$ = of(category).pipe(
      switchMap(c => c == null ? [] : this.getReports$(c.id)),
    );
    combineLatest([
      this.reports$, this.getReportId(), this.getCategoryId(),
    ]).pipe(switchMap(([report, reportId, categoryId]) => {
      if (!reportId && !categoryId) {
        let reportToShowId = report[0].id;
        if (reportType) {
          const newReport = report.find((r) => r.reportType === reportType)?.id;
          if (newReport) {
            reportToShowId = newReport;
          }
        }
        this.setStatisticsState(reportToShowId, category.id);
        this.selectedReportId = reportToShowId;
      } else {
        this.setStatisticsState(reportId, categoryId);
      }
      const availableReportId = this.selectedReportId || reportId || report[0]?.id;
      return combineLatest([this.loadFullReport(availableReportId), of(availableReportId)]);
    }),
    ).subscribe(([fullReport, reportId]: [UsageReport, string]) => {
      this.setReportId(fullReport, reportId);
    });
  }

  /**
   * Get the user reports for the specific category.
   * @param categoryId the that is being selected
   */
  getReports$(categoryId: string): Observable<UsageReport[]> {
    return this.scope$.pipe(
      switchMap((scope) => {
        return this.usageReportService.searchStatistics(scope._links.self.href, 0, 50, categoryId, this.parseDate(this.dateFrom), this.parseDate(this.dateTo), true);
      }),
    );
  }

  /**
   * Refresh categories when the date from is changed.
   */
  startDateChanged() {
    if (typeof this.dateFrom === 'object' || this.dateFrom === null || this.dateFrom === undefined) {
      this.clearFullReportCache();
      this.categories$ = this.getCategories$();
    }
  }

  /**
   * Refresh categories when the date to is changed.
   */
  endDateChanged() {
    if (typeof this.dateTo === 'object' || this.dateTo === null || this.dateTo === undefined) {
      this.clearFullReportCache();
      this.categories$ = this.getCategories$();
    }
  }

  /**
   * Parse date object type and return a string of year and day YY-MM.
   * @param dateObject: NgbDateStruct that is being parsed.
   */
  parseDate(dateObject: NgbDateStruct) {
    if ( !dateObject ) {
      return null;
    }
    const date: NgbDate = new NgbDate(dateObject.year, dateObject.month, dateObject.day);
    return this.ngbDateParserFormatter.format(date);
  }

  /**
   * stores a report id and cetegory id into state
   * @param reportId
   * @param categoryId
   */
  setStatisticsState(reportId: string ,categoryId: string) {
    this.store.dispatch(new SetCategoryReportAction(reportId, categoryId));
  }

  /**
   * This function called when the report is changed
   * @param reportId
   */
  changeReport(reportId: string) {
    this.selectedFullReport$.next(null);
    this.getCategoryId()
      .pipe(switchMap((categoryId) => combineLatest([this.loadFullReport(reportId), of(categoryId)])))
      .subscribe(([fullReport, categoryId]: [UsageReport, string]) => {
        this.setStatisticsState(reportId, categoryId);
        this.selectedReportId = reportId;
        this.setReportId(fullReport, reportId);
      });
  }

  /**
   * Load the full report (with points) for the given report id via the `findReport` search
   * method, applying the currently selected date range filter.
   * @param reportId the composite id (uuid_reportKey)
   */
  loadFullReport(reportId: string): Observable<UsageReport|null> {
    if (!reportId) {
      this.currentReportId = null;
      return of(null);
    }
    this.currentReportId = reportId;
    const cachedReport = this.fullReportCache.get(reportId);
    if (cachedReport) {
      return of(cachedReport);
    }

    let fullReport$: Observable<UsageReport> = this.inFlightRequests.get(reportId);
    if (!fullReport$) {
      fullReport$ = this.usageReportService.findReport(reportId, this.parseDate(this.dateFrom), this.parseDate(this.dateTo)).pipe(
        getFirstCompletedRemoteData(),
        getRemoteDataPayload(),
        shareReplay({ bufferSize: 1, refCount: true }),
        finalize(() => {
          this.inFlightRequests.delete(reportId);
        }),
      );
      this.inFlightRequests.set(reportId, fullReport$);
    }
    return fullReport$;

  }

  private clearFullReportCache() {
    this.fullReportCache.clear();
    this.inFlightRequests.clear();
    this.currentReportId = null;
    this.selectedFullReport$.next(null);
  }

  /**
   * returns report id from state
   * @returns { Observable<string> }
   */
  getReportId(): Observable<string> {
    return this.store.pipe(
      select(getReportId),
      take(1),
    );
  }

  /**
   * returns category id from state
   * @returns { Observable<string> }
   */
  getCategoryId(): Observable<string> {
    return this.store.pipe(
      select(getCategoryId),
      take(1),
    );
  }

  private setReportId(report: UsageReport, reportId) {
    if (report) {
      this.fullReportCache.set(reportId, report);
    }
    if (reportId === this.currentReportId) {
      this.selectedFullReport$.next(report);
    }
  }

  /**
   * Clean the statistics state in component's destroy
   */
  ngOnDestroy(): void {
    this.store.dispatch(new CleanCategoryReportAction());
  }
}
