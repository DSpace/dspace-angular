import { combineLatest as observableCombineLatest, Observable, Subscription } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchFilterConfig } from '../../../../search-service/search-filter-config.model';
import { SearchService } from '../../../../search-service/search.service';
import { SearchFilterService } from '../../search-filter.service';
import { hasValue } from '../../../../../shared/empty.util';
import { SearchConfigurationService } from '../../../../search-service/search-configuration.service';

@Component({
  selector: 'ds-search-facet-selected-option',
  templateUrl: './search-facet-selected-option.component.html',
})

/**
 * Represents a single selected option in a filter facet
 */
export class SearchFacetSelectedOptionComponent implements OnInit, OnDestroy {
  /**
   * The value for this component
   */
  @Input() selectedValue: string;

  /**
   * The filter configuration for this facet option
   */
  @Input() filterConfig: SearchFilterConfig;

  /**
   * Emits the active values for this filter
   */
  @Input() selectedValues$: Observable<string[]>;

  /**
   * UI parameters when this filter is removed
   */
  removeQueryParams;

  /**
   * Subscription to unsubscribe from on destroy
   */
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
    this.sub = observableCombineLatest(this.selectedValues$, this.searchConfigService.searchOptions)
      .subscribe(([selectedValues, searchOptions]) => {
        this.updateRemoveParams(selectedValues)
      });
  }

  /**
   * @returns {string} The base path to the search page
   */
  getSearchLink() {
    return this.searchService.getSearchLink();
  }

  /**
   * Calculates the parameters that should change if a given value for this filter would be removed from the active filters
   * @param {string[]} selectedValues The values that are currently selected for this filter
   */
  private updateRemoveParams(selectedValues: string[]): void {
    this.removeQueryParams = {
      [this.filterConfig.paramName]: selectedValues.filter((v) => v !== this.selectedValue),
      page: 1
    };
  }

  /**
   * TODO to review after https://github.com/DSpace/dspace-angular/issues/368 is resolved
   * Strips operator from filter value
   * e.g. 'test ,operator' => 'test'
   *
   * @param value
   */
  normalizeFilterValue(value: string) {
    return value.replace(/,[^,]*$/g, '');
  }

  /**
   * Make sure the subscription is unsubscribed from when this component is destroyed
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
