import { Component } from '@angular/core';
import { SearchService } from '../search-service/search.service';
import { Observable } from 'rxjs/Observable';
import { Params } from '@angular/router';
import { map } from 'rxjs/operators';
import { SearchFilterService } from '../search-filters/search-filter/search-filter.service';
import { hasValue, isNotEmpty } from '../../shared/empty.util';

@Component({
  selector: 'ds-search-labels',
  templateUrl: './search-labels.component.html',
})

export class SearchLabelsComponent {
  appliedFilters: Observable<Params>;

  constructor(private searchService: SearchService, private filterService: SearchFilterService) {
    this.appliedFilters = this.filterService.getCurrentFrontendFilters();
  }

  getRemoveParams(filterField: string, filterValue: string): Observable<Params> {
    return this.appliedFilters.pipe(
      map((filters) => {
        const field: string = Object.keys(filters).find((f) => f === filterField);
        const newValues = hasValue(filters[field]) ? filters[field].filter((v) => v !== filterValue) : null;
        return {
          [field]: isNotEmpty(newValues) ? newValues : null,
          page: 1
        };
      })
    )
  }

  getSearchLink() {
    return this.searchService.getSearchLink();
  }
}
