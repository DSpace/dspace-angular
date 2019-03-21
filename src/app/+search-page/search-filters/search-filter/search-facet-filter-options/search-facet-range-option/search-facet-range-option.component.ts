import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacetValue } from '../../../../search-service/facet-value.model';
import { SearchFilterConfig } from '../../../../search-service/search-filter-config.model';
import { SearchService } from '../../../../search-service/search.service';
import { SearchFilterService } from '../../search-filter.service';
import {
  RANGE_FILTER_MAX_SUFFIX,
  RANGE_FILTER_MIN_SUFFIX
} from '../../search-range-filter/search-range-filter.component';
import { SearchConfigurationService } from '../../../../search-service/search-configuration.service';
import { hasValue } from '../../../../../shared/empty.util';

const rangeDelimiter = '-';

@Component({
  selector: 'ds-search-facet-range-option',
  templateUrl: './search-facet-range-option.component.html',
})

/**
 * Represents a single option in a filter facet
 */
export class SearchFacetRangeOptionComponent implements OnInit, OnDestroy {
  /**
   * A single value for this component
   */
  @Input() filterValue: FacetValue;
  @Input() filterConfig: SearchFilterConfig;

  isVisible: Observable<boolean>;

  changeQueryParams;
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
    this.sub = this.searchConfigService.searchOptions.subscribe(() => {
      this.updateChangeParams()
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
   * Calculates the parameters that should change if a given values for this range filter would be changed
   * @param {string} value The values that are changed for this filter
   */
  updateChangeParams(): void {
    const parts = this.filterValue.value.split(rangeDelimiter);
    const min = parts.length > 1 ? parts[0].trim() : this.filterValue.value;
    const max = parts.length > 1 ? parts[1].trim() : this.filterValue.value;
    this.changeQueryParams = {
      [this.filterConfig.paramName + RANGE_FILTER_MIN_SUFFIX]: [min],
      [this.filterConfig.paramName + RANGE_FILTER_MAX_SUFFIX]: [max],
      page: 1
    };
  }

  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
