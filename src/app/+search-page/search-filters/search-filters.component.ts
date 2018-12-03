import { Observable, of as observableOf } from 'rxjs';

import { filter, map, mergeMap, startWith, switchMap } from 'rxjs/operators';
import { Component } from '@angular/core';
import { SearchService } from '../search-service/search.service';
import { RemoteData } from '../../core/data/remote-data';
import { SearchFilterConfig } from '../search-service/search-filter-config.model';
import { SearchConfigurationService } from '../search-service/search-configuration.service';
import { isNotEmpty } from '../../shared/empty.util';
import { SearchFilterService } from './search-filter/search-filter.service';
import { getSucceededRemoteData } from '../../core/shared/operators';

@Component({
  selector: 'ds-search-filters',
  styleUrls: ['./search-filters.component.scss'],
  templateUrl: './search-filters.component.html',
})

/**
 * This component represents the part of the search sidebar that contains filters.
 */
export class SearchFiltersComponent {
  /**
   * An observable containing configuration about which filters are shown and how they are shown
   */
  filters: Observable<RemoteData<SearchFilterConfig[]>>;

  /**
   * List of all filters that are currently active with their value set to null.
   * Used to reset all filters at once
   */
  clearParams;

  /**
   * Initialize instance variables
   * @param {SearchService} searchService
   * @param {SearchConfigurationService} searchConfigService
   * @param {SearchFilterService} filterService
   */
  constructor(private searchService: SearchService, private searchConfigService: SearchConfigurationService, private filterService: SearchFilterService) {
    this.filters = searchService.getConfig().pipe(getSucceededRemoteData());
    this.clearParams = searchConfigService.getCurrentFrontendFilters().pipe(map((filters) => {
      Object.keys(filters).forEach((f) => filters[f] = null);
      return filters;
    }));
  }

  /**
   * @returns {string} The base path to the search page
   */
  getSearchLink() {
    return this.searchService.getSearchLink();
  }

  /**
   * Check if a given filter is supposed to be shown or not
   * @param {SearchFilterConfig} filter The filter to check for
   * @returns {Observable<boolean>} Emits true whenever a given filter config should be shown
   */
  isActive(filterConfig: SearchFilterConfig): Observable<boolean> {
    // console.log(filter.name);
    return this.filterService.getSelectedValuesForFilter(filterConfig).pipe(
      mergeMap((isActive) => {
        if (isNotEmpty(isActive)) {
          return observableOf(true);
        } else {
          return this.searchConfigService.searchOptions.pipe(
            switchMap((options) => {
                return this.searchService.getFacetValuesFor(filterConfig, 1, options).pipe(
                  filter((RD) => !RD.isLoading),
                  map((valuesRD) => {
                    return valuesRD.payload.totalElements > 0
                  }),)
              }
            ))
        }
      }),startWith(true),);
  }
}
