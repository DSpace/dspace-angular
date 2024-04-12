import { Component, Input, OnInit } from '@angular/core';
import { map, Observable, of as observableOf } from 'rxjs';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { FilterConfig, SearchConfig } from '../../../core/shared/search/search-filters/search-config.model';
import { SearchFilterService } from '../../../core/shared/search/search-filter.service';
import { SearchFilterConfig } from '../models/search-filter-config.model';
import { Router } from '@angular/router';
import { InputSuggestion } from '../../input-suggestions/input-suggestions.model';
import { hasValue } from '../../empty.util';

@Component({
  selector: 'ds-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
})
export class AdvancedSearchComponent implements OnInit {

  @Input() configuration: string;

  @Input() filtersConfig: SearchFilterConfig[];

  advancedFilters$: Observable<FilterConfig[]>;

  advancedFilterMap$: Observable<Map<string, FilterConfig>>;

  currentFilter: string;

  currentOperator: string;

  /**
   * The value of the input field that is used to query for possible values for this filter
   */
  currentValue = '';

  /**
   * Emits the result values for this filter found by the current filter query
   */
  filterSearchResults$: Observable<InputSuggestion[]> = observableOf([]);

  constructor(
    protected router: Router,
    protected searchConfigurationService: SearchConfigurationService,
    protected searchFilterService: SearchFilterService,
  ) {
  }

  ngOnInit(): void {
    this.advancedFilters$ = this.searchConfigurationService.getConfigurationSearchConfig(this.configuration).pipe(
      map((searchConfiguration: SearchConfig) => searchConfiguration.filters),
    );
    this.advancedFilterMap$ = this.advancedFilters$.pipe(
      map((filters: FilterConfig[]) => {
        const filterMap: Map<string, FilterConfig> = new Map();
        if (filters.length > 0) {
          this.currentFilter = filters[0].filter;
          this.currentOperator = filters[0].operators[0].operator;
          for (const filter of filters) {
            filterMap.set(filter.filter, filter);
          }
        }
        return filterMap;
      }),
    );
  }

  findSuggestions(query: string): void {
    if (hasValue(this.filtersConfig)) {
      for (const filterConfig of this.filtersConfig) {
        if (filterConfig.name === this.currentFilter) {
          this.filterSearchResults$ = this.searchFilterService.findSuggestions(filterConfig, this.searchConfigurationService.searchOptions.value, query);
        }
      }
    }
  }

}
