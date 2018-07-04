import { Component } from '@angular/core';
import { SearchService } from '../search-service/search.service';
import { SearchFilterService } from '../search-filters/search-filter/search-filter.service';
import { Observable } from 'rxjs/Observable';
import { Params } from '@angular/router';

@Component({
  selector: 'ds-search-labels',
  // styleUrls: ['./search-labels.component.scss'],
  templateUrl: './search-labels.component.html',
})

export class SearchLabelsComponent {
  protected appliedFilters: Observable<Params>;

  constructor(private searchService: SearchService, private filterService: SearchFilterService) {
    this.appliedFilters = this.filterService.getCurrentFilters();
    console.log(this.appliedFilters.toArray());
  }

  getQueryParamsWithout(filterName: string, value: string): Observable<Params> {
    return this.filterService.getCurrentFilters();
    // return this.filterService.getQueryParamsWithoutByName(filterName, value);
  }

  getSearchLink() {
    return this.searchService.getSearchLink();
  }
}
