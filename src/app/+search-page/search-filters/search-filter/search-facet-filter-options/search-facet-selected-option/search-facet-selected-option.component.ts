import {
  combineLatest as observableCombineLatest,
  Observable,
  of as observableOf,
  Subscription
} from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FacetValue } from '../../../../search-service/facet-value.model';
import { SearchFilterConfig } from '../../../../search-service/search-filter-config.model';
import { SearchService } from '../../../../search-service/search.service';
import { SearchFilterService } from '../../search-filter.service';
import { hasValue } from '../../../../../shared/empty.util';
import { SearchOptions } from '../../../../search-options.model';
import { SearchConfigurationService } from '../../../../search-service/search-configuration.service';

@Component({
  selector: 'ds-search-facet-selected-option',
  templateUrl: './search-facet-selected-option.component.html',
})

/**
 * Represents a single option in a filter facet
 */
export class SearchFacetSelectedOptionComponent implements OnInit, OnDestroy {
  /**
   * A single value for this component
   */
  @Input() selectedValue: string;
  @Input() filterConfig: SearchFilterConfig;

  /**
   * Emits the active values for this filter
   */
  @Input() selectedValues$: Observable<string[]>;

  removeQueryParams;
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
   * @param {string} value The value that is removed for this filter
   * @returns {Observable<any>} The changed filter parameters
   */
  private updateRemoveParams(selectedValues: string[]): void {
    this.removeQueryParams = {
      [this.filterConfig.paramName]: selectedValues.filter((v) => v !== this.selectedValue),
      page: 1
    };
  }

  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
