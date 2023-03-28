import { SEARCH_CONFIG_SERVICE } from './../../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from './../../../core/shared/search/search-configuration.service';
import { SearchService } from './../../../core/shared/search/search.service';
import { Component, Inject, Input, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, switchMap, take, tap, mergeMap } from 'rxjs/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { SearchFilterConfig } from '../models/search-filter-config.model';
import { shrinkInOut } from '../../animations/shrink';
import { hasValue, isNotEmpty } from '../../empty.util';

@Component({
  selector: 'ds-search-charts',
  styleUrls: ['./search-charts.component.scss'],
  templateUrl: './search-charts.component.html',
  animations: [shrinkInOut]
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
   * The selected chart to show
   */
  selectedFilter: SearchFilterConfig;


  constructor(private searchService: SearchService,
    @Inject(SEARCH_CONFIG_SERVICE) private searchConfigService: SearchConfigurationService) {
  }

  ngOnInit(): void {
    this.filters.pipe(
      filter((rd: RemoteData<SearchFilterConfig[]>) => isNotEmpty(rd)),
      take(1),
      mergeMap((rd: RemoteData<SearchFilterConfig[]>) => {
        return this.hasFacetValues(rd.payload[0]).pipe(
          tap((hasValues) => {
            this.selectedFilter = this.selectedFilter
          ? this.selectedFilter
          : rd.hasSucceeded && hasValues ? rd.payload[0] : null;
          })
        );
      }),
    ).subscribe();
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
          }
        ));
    }
    return of(false);
  }
}
