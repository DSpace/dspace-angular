import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { map, Observable, of as observableOf, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { FilterConfig, SearchConfig } from '../../../core/shared/search/search-filters/search-config.model';
import { SearchFilterService } from '../../../core/shared/search/search-filter.service';
import { SearchFilterConfig } from '../models/search-filter-config.model';
import { Router, Params } from '@angular/router';
import { InputSuggestion } from '../../input-suggestions/input-suggestions.model';
import { hasValue, isNotEmpty } from '../../empty.util';
import { SearchService } from '../../../core/shared/search/search.service';

@Component({
  selector: 'ds-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
})
export class AdvancedSearchComponent implements OnInit, OnDestroy {

  @Input() configuration: string;

  @Input() filtersConfig: SearchFilterConfig[];

  advancedFilters$: Observable<FilterConfig[]>;

  advancedFilterMap: Map<string, FilterConfig> = new Map();

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

  subs: Subscription[] = [];

  constructor(
    protected router: Router,
    protected searchService: SearchService,
    protected searchConfigurationService: SearchConfigurationService,
    protected searchFilterService: SearchFilterService,
  ) {
  }

  ngOnInit(): void {
    this.advancedFilters$ = this.searchConfigurationService.getConfigurationSearchConfig(this.configuration).pipe(
      map((searchConfiguration: SearchConfig) => searchConfiguration.filters),
    );
    this.subs.push(this.advancedFilters$.subscribe((filters: FilterConfig[]) => {
      const filterMap: Map<string, FilterConfig> = new Map();
      if (filters.length > 0) {
        this.currentFilter = filters[0].filter;
        this.currentOperator = filters[0].operators[0].operator;
        for (const filter of filters) {
          filterMap.set(filter.filter, filter);
        }
      }
      this.advancedFilterMap = filterMap;
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
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

  applyFilter(): void {
    if (isNotEmpty(this.currentValue)) {
      this.subs.push(this.searchConfigurationService.selectNewAppliedFilterParams(this.currentFilter, this.currentValue.trim(), this.currentOperator).pipe(take(1)).subscribe((params: Params) => {
        void this.router.navigate([this.searchService.getSearchLink()], {
          queryParams: params,
        });
        this.currentValue = '';
      }));
    }
  }

}
