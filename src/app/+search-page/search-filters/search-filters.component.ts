import { Component } from '@angular/core';
import { SearchService } from '../search-service/search.service';
import { RemoteData } from '../../core/data/remote-data';
import { SearchFilterConfig } from '../search-service/search-filter-config.model';
import { Observable } from 'rxjs/Observable';
import { SearchFilterService } from './search-filter/search-filter.service';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-filters',
  styleUrls: ['./search-filters.component.scss'],
  templateUrl: './search-filters.component.html',
})

export class SearchFiltersComponent {
  filters: Observable<RemoteData<SearchFilterConfig[]>>;
  clearParams;
  constructor(private searchService: SearchService, private filterService: SearchFilterService) {
    this.filters = searchService.getConfig();
    this.clearParams = filterService.getCurrentFrontendFilters().map((filters) => {Object.keys(filters).forEach((f) => filters[f] = null); return filters;});
  }

  getSearchLink() {
    return this.searchService.getSearchLink();
  }
}
