import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { FilterConfig } from '../../../core/shared/search/search-filters/search-config.model';
import { SearchFilterService } from '../../../core/shared/search/search-filter.service';
import { SearchFilterConfig } from '../models/search-filter-config.model';
import { Router, Params } from '@angular/router';
import { InputSuggestion } from '../../input-suggestions/input-suggestions.model';
import { hasValue, isNotEmpty } from '../../empty.util';
import { SearchService } from '../../../core/shared/search/search.service';
import { FilterType } from '../models/filter-type.model';

/**
 * This component represents the advanced search in the search sidebar.
 */
@Component({
  selector: 'ds-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
})
export class AdvancedSearchComponent implements OnInit, OnDestroy {

  /**
   * The current search configuration
   */
  @Input() configuration: string;

  /**
   * The facet configurations, used to determine if suggestions should be retrieved for the selected search filter
   */
  @Input() filtersConfig: SearchFilterConfig[];

  /**
   * The current search scope
   */
  @Input() scope: string;

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
    this.advancedFilters$ = this.searchConfigurationService.getConfigurationAdvancedSearchFilters(this.configuration, this.scope);
    this.subs.push(this.advancedFilters$.subscribe((filters: FilterConfig[]) => {
      const filterMap: Map<string, FilterConfig> = new Map();
      if (filters.length > 0) {
        this.currentFilter = filters[0].filter;
        this.currentOperator = filters[0].operators[0].operator;
        for (const filter of filters) {
          if (filter.type !== FilterType.range) {
            filterMap.set(filter.filter, filter);
          }
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
      this.searchFilterService.minimizeAll();
      this.subs.push(this.searchConfigurationService.selectNewAppliedFilterParams(this.currentFilter, this.currentValue.trim(), this.currentOperator).pipe(take(1)).subscribe((params: Params) => {
        void this.router.navigate([this.searchService.getSearchLink()], {
          queryParams: params,
        });
        this.currentValue = '';
      }));
    }
  }

}
