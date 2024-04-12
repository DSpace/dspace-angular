import { Component, Input, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { FilterConfig, SearchConfig } from '../../../core/shared/search/search-filters/search-config.model';

@Component({
  selector: 'ds-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
})
export class AdvancedSearchComponent implements OnInit {

  @Input() configuration: string;

  advancedFilters$: Observable<FilterConfig[]>;

  advancedFilterMap$: Observable<Map<string, FilterConfig>>;

  currentFilter: string;

  currentOperator: string;

  constructor(
    protected searchConfigurationService: SearchConfigurationService,
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

}
