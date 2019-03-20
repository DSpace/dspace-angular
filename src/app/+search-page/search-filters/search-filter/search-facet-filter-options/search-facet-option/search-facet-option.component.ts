import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacetValue } from '../../../../search-service/facet-value.model';
import { SearchFilterConfig } from '../../../../search-service/search-filter-config.model';
import { SearchService } from '../../../../search-service/search.service';
import { SearchFilterService } from '../../search-filter.service';

@Component({
  selector: 'ds-search-facet-option',
  templateUrl: './search-facet-option.component.html',
})

/**
 * Represents a single option in a filter facet
 */
export class SearchFacetOptionComponent implements OnInit {
  /**
   * A single value for this component
   */
  @Input() filterValue: FacetValue;
  @Input() filterConfig: SearchFilterConfig;

  /**
   * Emits the active values for this filter
   */
  selectedValues$: Observable<string[]>;

  isVisible: Observable<boolean>;

  addQueryParams;

  constructor(protected searchService: SearchService,
              protected filterService: SearchFilterService,
              protected router: Router
  ) {
  }

  /**
   * Initializes all observable instance variables and starts listening to them
   */
  ngOnInit(): void {
    this.selectedValues$ = this.filterService.getSelectedValuesForFilter(this.filterConfig);
    this.isVisible = this.isChecked().pipe(map((checked: boolean) => !checked));
    this.addQueryParams = this.getAddParams();
  }

  /**
   * Checks if a value for this filter is currently active
   */
  private isChecked(): Observable<boolean> {
    return this.filterService.isFilterActiveWithValue(this.filterConfig.paramName, this.filterValue.value);
  }

  /**
   * @returns {string} The base path to the search page
   */
  getSearchLink() {
    return this.searchService.getSearchLink();
  }

  /**
   * Calculates the parameters that should change if a given value for this filter would be added to the active filters
   * @param {string} value The value that is added for this filter
   * @returns {Observable<any>} The changed filter parameters
   */
  private getAddParams(): Observable<any> {
    return this.selectedValues$.pipe(map((selectedValues) => {
      return {
        [this.filterConfig.paramName]: [...selectedValues, this.filterValue.value],
        page: 1
      };
    }));
  }

}

