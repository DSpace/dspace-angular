import {
  AsyncPipe,
  KeyValuePipe,
} from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Params,
  Router,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
  Subscription,
} from 'rxjs';
import { take } from 'rxjs/operators';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../config/app-config.interface';
import { SearchService } from '../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { SearchFilterService } from '../../../core/shared/search/search-filter.service';
import { FilterConfig } from '../../../core/shared/search/search-filters/search-config.model';
import { BtnDisabledDirective } from '../../btn-disabled.directive';
import {
  hasValue,
  isNotEmpty,
} from '../../empty.util';
import { FilterInputSuggestionsComponent } from '../../input-suggestions/filter-suggestions/filter-input-suggestions.component';
import { InputSuggestion } from '../../input-suggestions/input-suggestions.model';
import { FilterType } from '../models/filter-type.model';
import { SearchFilterConfig } from '../models/search-filter-config.model';

/**
 * This component represents the advanced search in the search sidebar.
 */
@Component({
  selector: 'ds-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    FilterInputSuggestionsComponent,
    FormsModule,
    KeyValuePipe,
    TranslateModule,
  ],
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
  filterSearchResults$: Observable<InputSuggestion[]> = of([]);

  subs: Subscription[] = [];

  constructor(
    protected router: Router,
    protected searchService: SearchService,
    protected searchConfigurationService: SearchConfigurationService,
    protected searchFilterService: SearchFilterService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
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
