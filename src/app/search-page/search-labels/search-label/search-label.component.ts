import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Params } from '@angular/router';
import { SearchService } from '../../search-service/search.service';
import { map } from 'rxjs/operators';
import { hasValue, isNotEmpty } from '../../../shared/empty.util';

@Component({
  selector: 'ds-search-label',
  templateUrl: './search-label.component.html',
})

/**
 * Component that represents the label containing the currently active filters
 */
export class SearchLabelComponent implements OnInit {
  @Input() key: string;
  @Input() value: string;
  @Input() inPlaceSearch: boolean;
  @Input() appliedFilters: Observable<Params>;
  searchLink: string;
  removeParameters: Observable<Params>;

  /**
   * Initialize the instance variable
   */
  constructor(
    private searchService: SearchService) {
  }

  ngOnInit(): void {
    this.searchLink = this.getSearchLink();
    this.removeParameters = this.getRemoveParams();
  }

  /**
   * Calculates the parameters that should change if a given value for the given filter would be removed from the active filters
   * @returns {Observable<Params>} The changed filter parameters
   */
  getRemoveParams(): Observable<Params> {
    return this.appliedFilters.pipe(
      map((filters) => {
        const field: string = Object.keys(filters).find((f) => f === this.key);
        const newValues = hasValue(filters[field]) ? filters[field].filter((v) => v !== this.value) : null;
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
  private getSearchLink(): string {
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
