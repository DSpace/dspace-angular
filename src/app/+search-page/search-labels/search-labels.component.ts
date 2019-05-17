import { Component, Inject, Input } from '@angular/core';
import { SearchService } from '../search-service/search.service';
import { Observable } from 'rxjs';
import { Params } from '@angular/router';
import { map } from 'rxjs/operators';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { SearchConfigurationService } from '../search-service/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../+my-dspace-page/my-dspace-page.component';

@Component({
  selector: 'ds-search-labels',
  styleUrls: ['./search-labels.component.scss'],
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
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  /**
   * Initialize the instance variable
   */
  constructor(
    private searchService: SearchService,
    @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService) {
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
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  public getSearchLink(): string {
    if (this.inPlaceSearch) {
      return './';
    }
    return this.searchService.getSearchLink();
  }

  /**
   * TODO to review after https://github.com/DSpace/dspace-angular/issues/368 is resolved
   * Strips authority operator from filter value
   * e.g. 'test ,authority' => 'test'
   *
   * @param value
   */
  normalizeFilterValue(value: string) {
    // const pattern = /,[^,]*$/g;
    const pattern = /,authority*$/g;
    return value.replace(pattern, '');
  }
}
