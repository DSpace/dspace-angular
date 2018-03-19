import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from '../search-service/search.service';
import { RemoteData } from '../../core/data/remote-data';
import { SearchFilterConfig } from '../search-service/search-filter-config.model';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { hasValue } from '../../shared/empty.util';

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

export class SearchFiltersComponent implements OnDestroy, OnInit {
  filters: SearchFilterConfig[] = [];
  sub: Subscription;
  constructor(private searchService: SearchService) {
  }

  ngOnInit() {
    this.sub = this.searchService.getConfig()
      .distinctUntilChanged()
      .subscribe((filtersConfig) => {
        const filters = [];
        filtersConfig.forEach((filter) => {
          let newFilter = filter;
          // Force instance of the facet object to SearchFilterConfig
          if (!(filter instanceof SearchFilterConfig)) {
            newFilter = Object.assign(new SearchFilterConfig(), filter);
          }
          filters.push(newFilter);
        });
        this.filters = filters
      });
  }

  getClearFiltersQueryParams(): any {
    return this.searchService.getClearFiltersQueryParams();
  }

  getSearchLink() {
    return this.searchService.getSearchLink();
  }

  ngOnDestroy() {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
