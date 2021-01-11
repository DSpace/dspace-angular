import { Component, Inject, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { SEARCH_CONFIG_SERVICE } from '../../../+my-dspace-page/my-dspace-page.component';
import { RemoteData } from '../../../core/data/remote-data';
import { getSucceededRemoteData } from '../../../core/shared/operators';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { SearchService } from '../../../core/shared/search/search.service';
import { SearchFilterConfig } from '../search-filter-config.model';

@Component({
  selector: 'ds-search-charts',
  styleUrls: ['./search-charts.component.scss'],
  templateUrl: './search-charts.component.html',
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
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  /**
   * An observable containing configuration about which filters are shown and how they are shown
   */
  filters: Observable<RemoteData<SearchFilterConfig[]>>;

  selectedTypeIndex = 0;

  selectedFilter: any;

  /**
   * For chart regular expression
   */
  chartReg = new RegExp(/^chart./, 'i')

  /**
   * Initialize instance variables
   * @param {SearchService} searchService
   * @param {SearchConfigurationService} searchConfigService
   */
  constructor(
    private searchService: SearchService,
    @Inject(SEARCH_CONFIG_SERVICE)
    @Inject(SEARCH_CONFIG_SERVICE)
    private searchConfigService: SearchConfigurationService
  ) {}

  ngOnInit(): void {
    this.filters = this.searchConfigService.searchOptions
      .pipe(
        switchMap((options) =>
          this.searchService
            .getConfig(options.scope, options.configuration)
            .pipe(getSucceededRemoteData())
        ),
        map((rd: RemoteData<SearchFilterConfig[]>) => Object.assign(rd, {
          payload: rd.payload.filter((filter: SearchFilterConfig) =>
            this.chartReg.test(filter.type)
          )})
        ),
        tap((rd: RemoteData<SearchFilterConfig[]>) => {
          this.selectedFilter = this.selectedFilter
            ? this.selectedFilter
            : rd.payload[0];
        })
      );
  }

  /**
   * Prevent unnecessary rerendering
   */
  trackUpdate(index, config: SearchFilterConfig) {
    return config ? config.name : undefined;
  }

  changeChartType(filter) {
    this.selectedFilter = filter;
  }
}
