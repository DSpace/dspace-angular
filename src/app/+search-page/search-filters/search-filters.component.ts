import { Component, Input } from '@angular/core';
import { SearchService } from '../search-service/search.service';
import { RemoteData } from '../../core/data/remote-data';
import { SearchFilterConfig } from '../search-service/search-filter-config.model';
import { Observable } from 'rxjs/Observable';

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

export class SidebarFiltersComponent {
  filters: Observable<RemoteData<SearchFilterConfig[]>>;
  constructor(private searchService: SearchService) {
    this.filters = searchService.getConfig();
  }

  getClearFiltersQueryParams(): any {
    return this.searchService.getClearFiltersQueryParams();
  }

  getSearchLink() {
    return this.searchService.getSearchLink();
  }
}
