import { combineLatest as observableCombineLatest, Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacetValue } from '../../../../search-service/facet-value.model';
import { SearchFilterConfig } from '../../../../search-service/search-filter-config.model';
import { SearchService } from '../../../../search-service/search.service';
import { SearchFilterService } from '../../search-filter.service';
import { SearchConfigurationService } from '../../../../search-service/search-configuration.service';
import { hasValue } from '../../../../../shared/empty.util';

@Component({
  selector: 'ds-search-facet-option',
  templateUrl: './search-facet-option.component.html',
})

/**
 * Represents a single option in a filter facet
 */
export class SearchFacetOptionComponent implements OnInit, OnDestroy {
  /**
   * A single value for this component
   */
  @Input() filterValue: FacetValue;
  @Input() filterConfig: SearchFilterConfig;
  @Input() selectedValues$: Observable<string[]>;

  isVisible: Observable<boolean>;

  addQueryParams;
  sub: Subscription;

  constructor(protected searchService: SearchService,
              protected filterService: SearchFilterService,
              protected searchConfigService: SearchConfigurationService,
              protected router: Router
  ) {
  }

  /**
   * Initializes all observable instance variables and starts listening to them
   */
  ngOnInit(): void {
    this.isVisible = this.isChecked().pipe(map((checked: boolean) => !checked));
    this.sub = observableCombineLatest(this.selectedValues$, this.searchConfigService.searchOptions)
      .subscribe(([selectedValues, searchOptions]) => {
        this.updateAddParams(selectedValues)
      });
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
   */
  private updateAddParams(selectedValues: string[]): void {
    this.addQueryParams = {
      [this.filterConfig.paramName]: [...selectedValues, this.filterValue.value],
      page: 1
    };
  }

  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
