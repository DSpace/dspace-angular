import { AfterViewChecked, Component, Inject, Input, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { SearchService } from '../../../core/shared/search/search.service';
import { RemoteData } from '../../../core/data/remote-data';
import { SearchFilterConfig } from '../models/search-filter-config.model';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { SearchFilterService } from '../../../core/shared/search/search-filter.service';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-page.component';
import { currentPath } from '../../utils/route.utils';
import { hasValue } from '../../empty.util';
import { APP_CONFIG, AppConfig } from '../../../../config/app-config.interface';

@Component({
  selector: 'ds-search-filters',
  styleUrls: ['./search-filters.component.scss'],
  templateUrl: './search-filters.component.html',

})

/**
 * This component represents the part of the search sidebar that contains filters.
 */
export class SearchFiltersComponent implements OnInit, AfterViewChecked, OnDestroy {
  /**
   * An observable containing configuration about which filters are shown and how they are shown
   */
  @Input() filters: Observable<RemoteData<SearchFilterConfig[]>>;

  /**
   * List of all filters that are currently active with their value set to null.
   * Used to reset all filters at once
   */
  clearParams;

  /**
   * The configuration to use for the search options
   */
  @Input() currentConfiguration;

  /**
   * The current search scope
   */
  @Input() currentScope: string;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  /**
   * Emits when the search filters values may be stale, and so they must be refreshed.
   */
  @Input() refreshFilters: BehaviorSubject<boolean>;

  /**
   * List of element references to all filters
   */
  @ViewChildren('searchFilter') searchFilter;

  /**
   * counts for the active filters
   */
  availableFilters = false;

  /**
   * Link to the search page
   */
  searchLink: string;

  /**
   * Filters for which visibility has been computed
   */
  filtersWithComputedVisibility = 0;

  subs = [];
  defaultFilterCount: number;

  /**
   * Initialize instance variables
   * @param {SearchService} searchService
   * @param {SearchFilterService} filterService
   * @param {Router} router
   * @param {SearchConfigurationService} searchConfigService
   * @param appConfig
   */
  constructor(
    private searchService: SearchService,
    private filterService: SearchFilterService,
    private router: Router,
    @Inject(SEARCH_CONFIG_SERVICE) private searchConfigService: SearchConfigurationService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    this.defaultFilterCount = this.appConfig.search.filterPlaceholdersCount ?? 5;
  }

  ngOnInit(): void {
    this.clearParams = this.searchConfigService.getCurrentFrontendFilters().pipe(
      tap(() => this.filtersWithComputedVisibility = 0),
      map((filters) => {
        Object.keys(filters).forEach((f) => filters[f] = null);
        return filters;
      })
    );
    this.searchLink = this.getSearchLink();
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
    }
    return this.searchService.getSearchLink();
  }

  /**
   * Prevent unnecessary rerendering
   */
  trackUpdate(index, config: SearchFilterConfig) {
    return config ? config.name : undefined;
  }

  ngAfterViewChecked() {
    this.availableFilters = this.searchFilter._results.some(element => element.nativeElement?.children[0]?.children.length > 0);
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => {
      if (hasValue(sub)) {
        sub.unsubscribe();
      }
    });
  }

  countFiltersWithComputedVisibility(computed: boolean) {
    if (computed) {
      this.filtersWithComputedVisibility += 1;
    }
  }
}
