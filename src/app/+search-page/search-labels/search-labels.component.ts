import { Component } from '@angular/core';
import { SearchService } from '../search-service/search.service';
import { Observable } from 'rxjs/Observable';
import { Params } from '@angular/router';
import { map } from 'rxjs/operators';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { SearchConfigurationService } from '../search-service/search-configuration.service';

@Component({
  selector: 'ds-search-labels',
  templateUrl: './search-labels.component.html',
})

/**
 * Component that represents the labels containing the currently active filters
 */
export class SearchLabelsComponent {
  /**
   * Emits the currently active filters
   */
  appliedFilters: Observable<Params>;

  /**
   * Initialize the instance variable
   */
  constructor(private searchService: SearchService, private searchConfigService: SearchConfigurationService) {
    this.appliedFilters = this.searchConfigService.getCurrentFrontendFilters();
  }

  /**
   * Calculates the parameters that should change if a given value for the given filter would be removed from the active filters
   * @param {string} filterField The filter field parameter name from which the value should be removed
   * @param {string} filterValue The value that is removed for this given filter field
   * @returns {Observable<Params>} The changed filter parameters
   */
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

  /**
   * @returns {string} The base path to the search page
   */
  getSearchLink() {
    return this.searchService.getSearchLink();
  }
}
