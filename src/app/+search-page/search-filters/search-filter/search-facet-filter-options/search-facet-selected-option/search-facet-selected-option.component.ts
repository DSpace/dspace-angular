import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacetValue } from '../../../../search-service/facet-value.model';
import { SearchFilterConfig } from '../../../../search-service/search-filter-config.model';
import { SearchService } from '../../../../search-service/search.service';
import { SearchFilterService } from '../../search-filter.service';

@Component({
  selector: 'ds-search-facet-selected-option',
  templateUrl: './search-facet-selected-option.component.html',
})

/**
 * Represents a single option in a filter facet
 */
export class SearchFacetSelectedOptionComponent implements OnInit {
  /**
   * A single value for this component
   */
  @Input() selectedValue: string;
  @Input() filterConfig: SearchFilterConfig;

  /**
   * Emits the active values for this filter
   */
  selectedValues$: Observable<string[]>;

  removeQueryParams;

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
    this.removeQueryParams = this.getRemoveParams();
  }

  /**
   * @returns {string} The base path to the search page
   */
  getSearchLink() {
    return this.searchService.getSearchLink();
  }

  /**
   * Calculates the parameters that should change if a given value for this filter would be removed from the active filters
   * @param {string} value The value that is removed for this filter
   * @returns {Observable<any>} The changed filter parameters
   */
  private getRemoveParams(): Observable<any> {
    return this.selectedValues$.pipe(map((selectedValues) => {
      return {
        [this.filterConfig.paramName]: selectedValues.filter((v) => v !== this.selectedValue),
        page: 1
      };
    }));
  }
}

