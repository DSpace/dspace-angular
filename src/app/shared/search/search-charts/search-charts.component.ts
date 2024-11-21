import {
  AsyncPipe,
  isPlatformBrowser,
  NgClass,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest as observableCombineLatest,
  Observable,
  of,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { RemoteData } from '../../../core/data/remote-data';
import { getRemoteDataPayload } from '../../../core/shared/operators';
import { SearchService } from '../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-configuration.service';
import { shrinkInOut } from '../../animations/shrink';
import {
  hasValue,
  isNotEmpty,
} from '../../empty.util';
import { VarDirective } from '../../utils/var.directive';
import { SearchFilterConfig } from '../models/search-filter-config.model';
import { SearchChartComponent } from './search-chart/search-chart.component';

@Component({
  selector: 'ds-search-charts',
  styleUrls: ['./search-charts.component.scss'],
  templateUrl: './search-charts.component.html',
  animations: [shrinkInOut],
  imports: [
    NgbTooltipModule,
    TranslateModule,
    AsyncPipe,
    NgClass,
    NgIf,
    NgForOf,
    SearchChartComponent,
    VarDirective,
  ],
  standalone: true,
})

/**
 * This component represents the part of the search sidebar that contains filters.
 */
export class SearchChartsComponent implements OnInit {
  /**
   * An observable containing configuration about which filters are shown and how they are shown
   */
  @Input() filters: Observable<RemoteData<SearchFilterConfig[]>>;

  /**
   * The currently applied configuration (determines title of search)
   */
  @Input() configuration: Observable<string>;

  /**
   * Defines whether to start as showing the charts collapsed
   */
  @Input() collapseChart = false;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  /**
   * Emits when the search filters values may be stale, and so they must be refreshed.
   */
  @Input() refreshFilters: BehaviorSubject<boolean>;

  /**
   * Toggle button to Show/Hide chart
   */
  @Input() showChartsToggle = false;

  /**
   * The scope of the search
   */
  @Input() scope: string;

  /**
   * The selected chart to show
   */
  selectedFilter: SearchFilterConfig;

  /**
   * Whether a platform id represents a browser platform.
   */
  isPlatformBrowser: boolean;

  /**
   * Array with charts visibility
   */
  chartsVisibilityList$: Observable<boolean[]> = of([true]);

  /**
   *
   * @param cdr
   * @param searchService
   * @param platformId
   * @param searchConfigService
   */

  constructor(
    private cdr: ChangeDetectorRef,
    private searchService: SearchService,
    @Inject(PLATFORM_ID) protected platformId: any,
    @Inject(SEARCH_CONFIG_SERVICE) private searchConfigService: SearchConfigurationService,
  ) {}

  ngOnInit(): void {
    this.isPlatformBrowser = isPlatformBrowser(this.platformId);

    this.chartsVisibilityList$ = this.filters.pipe(
      filter((rd: RemoteData<SearchFilterConfig[]>) => isNotEmpty(rd)),
      mergeMap(rd => {
        const filterGuards = rd.payload.map(filterConfig => this.canShowChart(filterConfig));
        return observableCombineLatest([...filterGuards]);
      }),
      distinctUntilChanged(),
    );

    if (isPlatformBrowser(this.platformId)) {
      this.filters.pipe(
        filter((rd: RemoteData<SearchFilterConfig[]>) => isNotEmpty(rd)),
        take(1),
        mergeMap((rd: RemoteData<SearchFilterConfig[]>) => {
          const filterConfigs = rd.payload;
          return this.hasFacetValues(filterConfigs[0]).pipe(
            tap((hasValues) => {
              this.selectedFilter = this.selectedFilter
                ? this.selectedFilter
                : rd.hasSucceeded && hasValues ? filterConfigs[0] : null;
              this.cdr.detectChanges();
            }),
          );
        }),
        switchMap(() => this.canShowChart(this.selectedFilter)),
      ).subscribe();
    }
  }

  /**
   * Prevent unnecessary rendering
   */
  trackUpdate(index, config: SearchFilterConfig) {
    return config ? config.name : undefined;
  }

  /**
   * Change the current chart filter selected
   *
   * @param searchfilter
   */
  changeChartType(searchfilter: SearchFilterConfig) {
    this.selectedFilter = searchfilter;
  }

  /**
   * To Toggle the Chart
   */
  toggleChart() {
    this.collapseChart = !this.collapseChart;
  }

  /**
   * Checks if the filter config has facet values
   * @param filterConfig the filter config to check
   * @returns {Observable<boolean>} true if the filter config has facet values
   */
  hasFacetValues(filterConfig: SearchFilterConfig): Observable<boolean> {
    if (hasValue(filterConfig)) {
      return this.searchConfigService.searchOptions.pipe(
        switchMap((options) => {
          return this.searchService.getFacetValuesFor(filterConfig, 1, options).pipe(
            filter((RD) => !RD.isLoading),
            map((valuesRD) => valuesRD.payload.totalElements > 0));
        },
        ));
    }
    return of(false);
  }

  /**
   * Checks if the filter config tab can be shown or if chart section should be hidden
   * based on the filter config has facet values and the selected filter.
   * If the selected filter is the filter config to check and it doesn't have facet values,
   * the selected filter will be changed to the previous filter config that has facet values.
   * If the previous filter config doesn't exist, the selected filter will be changed to the next filter config that has facet values.
   * @param filterConfig the filter config to check
   * @returns {Observable<boolean>} if the filter config tab can be shown or if chart section should be hidden
   */
  canShowChart(filterConfig: SearchFilterConfig): Observable<boolean> {
    return this.hasFacetValues(filterConfig).pipe(
      mergeMap((hasValues: boolean) => this.filters.pipe(
        filter((rd: RemoteData<SearchFilterConfig[]>) => isNotEmpty(rd)),
        take(1),
        getRemoteDataPayload(),
        map((configs: SearchFilterConfig[]) => {
          if (!hasValues && this.selectedFilter === filterConfig) {
            const index = configs.findIndex(x => x.filterType === this.selectedFilter.filterType);
            if (index > -1) {
              if (hasValue(configs[index - 1])) {
                this.changeChartType(configs[index - 1]);
              } else {
                this.selectedFilter = hasValue(configs[index + 1]) ? configs[index + 1] : null;
              }
            }
            return false;
          }

          return hasValues;
        }),
      )),
    );
  }
}
