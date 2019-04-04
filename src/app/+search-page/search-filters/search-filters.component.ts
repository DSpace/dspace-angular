import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { Component } from '@angular/core';
import { SearchService } from '../search-service/search.service';
import { RemoteData } from '../../core/data/remote-data';
import { SearchFilterConfig } from '../search-service/search-filter-config.model';
import { SearchConfigurationService } from '../search-service/search-configuration.service';
import { SearchFilterService } from './search-filter/search-filter.service';
import { getSucceededRemoteData } from '../../core/shared/operators';

@Component({
  selector: 'ds-search-filters',
  styleUrls: ['./search-filters.component.scss'],
  templateUrl: './themes/search-filters.component.mantis.html',
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
   * Prevent unnecessary rerendering
   */
  trackUpdate(index, config: SearchFilterConfig) {
    return config ? config.name : undefined;
  }
}
