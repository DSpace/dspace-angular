import { Component } from '@angular/core';
import { SearchService } from '../search-service/search.service';
import { Observable } from 'rxjs/Observable';
import { Params } from '@angular/router';
import { FilterLabel } from '../search-service/filter-label.model';
import { map } from 'rxjs/operators';
import { SearchFilterService } from '../search-filters/search-filter/search-filter.service';

@Component({
  selector: 'ds-search-labels',
  templateUrl: './search-labels.component.html',
})

export class SearchLabelsComponent {
  appliedFilters: Observable<FilterLabel[]>;

  constructor(private searchService: SearchService, private filterService: SearchFilterService) {
    this.appliedFilters = this.filterService.getCurrentFilterLabels();
  }

  getRemoveParams(filterLabel: FilterLabel): Observable<Params> {
    return this.appliedFilters.pipe(
      map((filters) => {
        const values = [];
        filters.forEach((filter) => {
          if (filter.field === filterLabel.field && filter.value !== filterLabel.value) {
            values.push(filter.value);
          }
        });
        return {
          [filterLabel.field]: values,
          page: 1
        };
      })
    );
  }

  getSearchLink() {
    return this.searchService.getSearchLink();
  }
}
