import { Component, Inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SEARCH_CONFIG_SERVICE } from '../../../+my-dspace-page/my-dspace-page.component';
import { RemoteData } from '../../../core/data/remote-data';
import { getSucceededRemoteData } from '../../../core/shared/operators';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { SearchService } from '../../../core/shared/search/search.service';
import { FilterType } from '../filter-type.model';
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
   * An observable containing configuration about which filters are shown and how they are shown
   */
  filters: Observable<RemoteData<SearchFilterConfig[]>>;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  selectedTypeIndex = 0;

  selectedFilter: any;

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
        )
      )
      .pipe(
        map((item) => ({
          isLoading: item.isLoading,
          hasFailed: item.hasFailed,
          isRequestPending: item.isRequestPending,
          isResponsePending: item.isResponsePending,
          state: item.state,
          hasSucceeded: item.hasSucceeded,
          hasNoContent: item.hasNoContent,
          payload: item.payload.filter(
            (i) =>
              i.type === FilterType['chart.bar'] ||
              i.type === FilterType['chart.line'] ||
              i.type === FilterType['chart.pie']
          ),
        }))
      ).pipe(map((res) => {
        this.selectedFilter = res.payload[0];
        return res;
      }));
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
