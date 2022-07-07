import { Component, Inject, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-page.component';
import { RemoteData } from '../../../core/data/remote-data';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { SearchService } from '../../../core/shared/search/search.service';
import { SearchFilterConfig } from '../models/search-filter-config.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { shrinkInOut } from '../../animations/shrink';

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
   * Toggle button to Show/Hide chart
   */
  @Input() showChartsToggle = false;

  /**
   * An observable containing configuration about which filters are shown and how they are shown
   */
  filters: Observable<RemoteData<SearchFilterConfig[]>>;

  selectedTypeIndex = 0;

  selectedFilter: any;

  /**
   * For chart regular expression
   */
  chartReg = new RegExp(/^chart./, 'i');

  /**
   * Initialize instance variables
   * @param {SearchService} searchService
   * @param {SearchConfigurationService} searchConfigService
   */
  constructor(
    @Inject(SEARCH_CONFIG_SERVICE) private searchConfigService: SearchConfigurationService,
    private searchService: SearchService,
  ) {
  }

  ngOnInit(): void {
    this.filters = this.searchConfigService.searchOptions.pipe(
      switchMap((options) => this.searchService.getConfig(options?.scope, options?.configuration)),
      getFirstCompletedRemoteData(),
      map((rd: RemoteData<SearchFilterConfig[]>) => {
        if (rd.hasSucceeded) {
          return Object.assign(rd, {
            payload: rd.payload.filter((filter: SearchFilterConfig) =>
              this.chartReg.test(filter.filterType)
            )
          });
        } else {
          return rd;
        }
      }),
      tap((rd: RemoteData<SearchFilterConfig[]>) => {
        this.selectedFilter = this.selectedFilter
          ? this.selectedFilter
          : rd.hasSucceeded ? rd.payload[0] : null;
      })
    );
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
   * @param filter
   */
  changeChartType(filter) {
    this.selectedFilter = filter;
  }

  /**
   * To Toggle the Chart
   */
  toggleChart() {
    this.collapseChart = !this.collapseChart;
  }
}
