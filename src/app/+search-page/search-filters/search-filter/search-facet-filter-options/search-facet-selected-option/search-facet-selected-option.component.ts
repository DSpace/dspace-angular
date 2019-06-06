import { combineLatest as observableCombineLatest, Observable, Subscription } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchFilterConfig } from '../../../../search-service/search-filter-config.model';
import { SearchService } from '../../../../search-service/search.service';
import { SearchFilterService } from '../../search-filter.service';
import { hasValue } from '../../../../../shared/empty.util';
import { SearchConfigurationService } from '../../../../search-service/search-configuration.service';
import { FacetValue } from '../../../../search-service/facet-value.model';
import { FilterType } from '../../../../search-service/filter-type.model';

@Component({
  selector: 'ds-search-facet-selected-option',
  styleUrls: ['./search-facet-selected-option.component.scss'],
  templateUrl: './search-facet-selected-option.component.html',
})

/**
 * Represents a single selected option in a filter facet
 */
export class SearchFacetSelectedOptionComponent implements OnInit, OnDestroy {
  /**
   * The value for this component
   */
  @Input() selectedValue: FacetValue;

  /**
   * The filter configuration for this facet option
   */
  @Input() filterConfig: SearchFilterConfig;

  /**
   * Emits the active values for this filter
   */
  @Input() selectedValues$: Observable<FacetValue[]>;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

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
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  public getSearchLink(): string {
    if (this.inPlaceSearch) {
      return './';
    }
    return this.searchService.getSearchLink();
  }

  /**
   * Calculates the parameters that should change if a given value for this filter would be removed from the active filters
   * @param {string[]} selectedValues The values that are currently selected for this filter
   */
  private updateRemoveParams(selectedValues: FacetValue[]): void {
    this.removeQueryParams = {
      [this.filterConfig.paramName]: selectedValues
        .filter((facetValue: FacetValue) => facetValue.label !== this.selectedValue.label)
        .map((facetValue: FacetValue) => this.getFacetValue(facetValue)),
      page: 1
    };
  }

  /**
   * TODO to review after https://github.com/DSpace/dspace-angular/issues/368 is resolved
   * Retrieve facet value related to facet type
   */
  private getFacetValue(facetValue: FacetValue): string {
    if (this.filterConfig.type === FilterType.authority) {
      const search = facetValue.search;
      const hashes = search.slice(search.indexOf('?') + 1).split('&');
      const params = {};
      hashes.map((hash) => {
        const [key, val] = hash.split('=');
        params[key] = decodeURIComponent(val)
      });

      return params[this.filterConfig.paramName];
    } else {
      return facetValue.value;
    }
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
