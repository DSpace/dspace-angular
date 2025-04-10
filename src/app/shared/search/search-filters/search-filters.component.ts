import { AfterViewChecked, Component, Inject, Input, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

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
   * Keeps track of the filters computed for each configuration during the current rendering cycle
   * This array stores objects with configuration identifier and number of computed filters
   */
  private currentFiltersComputed = [];

  /**
   * Stores the final count of computed filters for each configuration
   * Used to determine when all filters for a configuration have been processed
   */
  private finalFiltersComputed = [];

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
    this.router.events.subscribe(() => {
      this.clearParams = this.searchConfigService.getCurrentFrontendFilters().pipe(
        map((filters) => {
          Object.keys(filters).forEach((f) => filters[f] = null);
          return filters;
        })
      );
      this.searchLink = this.getSearchLink();
    });
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
      this.filters.pipe(
        // Get filter data and check if we need to increment the counter
        map(filtersData => {
          if (filtersData && filtersData.hasSucceeded && filtersData.payload) {
            const totalFilters = filtersData.payload.length;
            const currentComputed = this.getCurrentFiltersComputed(this.currentConfiguration);

            // If we've already computed all filters for this configuration
            if (currentComputed >= totalFilters) {
              // Register in finalFiltersComputed if not already registered
              if (!this.findConfigInFinalFilters(this.currentConfiguration)) {
                this.updateFinalFiltersComputed(this.currentConfiguration, totalFilters);
              }
              return { shouldIncrement: false };
            }

            // We haven't reached the total yet, proceed with increment
            return {
              shouldIncrement: true,
              totalFilters
            };
          }
          return { shouldIncrement: false };
        }),
        // Only continue if we need to increment the counter
        filter(result => result.shouldIncrement),
        // Increment the counter for the current configuration
        map(result => {
          const filterConfig = this.findConfigInCurrentFilters(this.currentConfiguration);

          if (filterConfig) {
            // Update existing counter
            filterConfig.filtersComputed += 1;
          } else {
            // Create new counter entry
            this.currentFiltersComputed.push({
              configuration: this.currentConfiguration,
              filtersComputed: 1
            });
          }

          // Pass along the total and updated count
          return {
            totalFilters: result.totalFilters,
            currentComputed: this.getCurrentFiltersComputed(this.currentConfiguration)
          };
        }),
        // Check if we've reached the total after incrementing
        map(result => {
          if (result.currentComputed === result.totalFilters) {
            // If we've reached the total, update final filters count
            this.updateFinalFiltersComputed(this.currentConfiguration, result.currentComputed);
          }
          return result;
        }),
        // Automatically complete the observable after one emission
        take(1)
      ).subscribe();
    }
  }

  /**
   * Finds a configuration entry in the currentFiltersComputed array
   * @param configuration The configuration identifier to search for
   * @returns The filter configuration object if found, otherwise undefined
   */
  private findConfigInCurrentFilters(configuration: string) {
    return this.currentFiltersComputed.find(
      (configFilter) => configFilter.configuration === configuration
    );
  }

  /**
   * Finds a configuration entry in the finalFiltersComputed array
   * @param configuration The configuration identifier to search for
   * @returns The filter configuration object if found, otherwise undefined
   */
  private findConfigInFinalFilters(configuration: string) {
    return this.finalFiltersComputed.find(
      (configFilter) => configFilter.configuration === configuration
    );
  }

  /**
   * Updates or adds a new entry in the finalFiltersComputed array
   * @param configuration The configuration identifier to update
   * @param count The number of computed filters to set for this configuration
   */
  private updateFinalFiltersComputed(configuration: string, count: number) {
    const filterConfig = this.findConfigInFinalFilters(configuration);

    if (filterConfig) {
      filterConfig.filtersComputed = count;
    } else {
      this.finalFiltersComputed.push({
        configuration,
        filtersComputed: count
      });
    }
  }

  /**
   * Gets the current number of computed filters for a specific configuration
   * @param configuration The configuration identifier to get the count for
   * @returns The number of computed filters, or 0 if none found
   */
  private getCurrentFiltersComputed(configuration: string) {
    const configFilter = this.findConfigInCurrentFilters(configuration);
    return configFilter?.filtersComputed || 0;
  }

  /**
   * Gets the final number of computed filters for a specific configuration
   * @param configuration The configuration identifier to get the count for
   * @returns The number of computed filters in the final state, or 0 if none found
   */
  getFinalFiltersComputed(configuration: string): number {
    const configFilter = this.findConfigInFinalFilters(configuration);
    return configFilter?.filtersComputed || 0;
  }
}
