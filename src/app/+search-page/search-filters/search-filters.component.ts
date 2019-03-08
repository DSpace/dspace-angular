import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, of as observableOf, Subscription } from 'rxjs';
import { filter, first, map, mergeMap, startWith, switchMap, tap } from 'rxjs/operators';

import { SearchService } from '../search-service/search.service';
import { RemoteData } from '../../core/data/remote-data';
import { SearchFilterConfig } from '../search-service/search-filter-config.model';
import { SearchConfigurationService } from '../search-service/search-configuration.service';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { SearchFilterService } from './search-filter/search-filter.service';
import { getSucceededRemoteData } from '../../core/shared/operators';
import { PaginatedSearchOptions } from '../paginated-search-options.model';
import { SEARCH_CONFIG_SERVICE } from '../../+my-dspace-page/my-dspace-page.component';

@Component({
  selector: 'ds-search-filters',
  styleUrls: ['./search-filters.component.scss'],
  templateUrl: './search-filters.component.html',
})

/**
 * This component represents the part of the search sidebar that contains filters.
 */
export class SearchFiltersComponent implements OnDestroy, OnInit {

  /**
   * An Array containing configuration about which filters are shown and how they are shown
   */
  filters: SearchFilterConfig[] = [];

  /**
   * List of all filters that are currently active with their value set to null.
   * Used to reset all filters at once
   */
  clearParams;

  /**
   * A boolean representing load state of filters configuration
   */
  isLoadingFilters$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  /**
   * The current paginated search options
   */
  searchOptions$: Observable<PaginatedSearchOptions>;

  private sub: Subscription;

  /**
   * Initialize instance variables
   * @param {ChangeDetectorRef} cdr
   * @param {SearchService} searchService
   * @param {SearchConfigurationService} searchConfigService
   * @param {SearchFilterService} filterService
   */
  constructor(
    private cdr: ChangeDetectorRef,
    private searchService: SearchService,
    @Inject(SEARCH_CONFIG_SERVICE) private searchConfigService: SearchConfigurationService,
    private filterService: SearchFilterService) {
  }

  ngOnInit(): void {
    this.searchOptions$ = this.searchConfigService.searchOptions;

    this.sub = this.searchOptions$.pipe(
      tap(() => this.setLoading()),
      switchMap((options) => this.searchService.getConfig(options.scope, options.configuration).pipe(getSucceededRemoteData())))
      .subscribe((filtersRD: RemoteData<SearchFilterConfig[]>) => {
        this.filters = filtersRD.payload;
        this.isLoadingFilters$.next(false);
      });

    this.clearParams = this.searchConfigService.getCurrentFrontendFilters().pipe(map((filters) => {
      Object.keys(filters).forEach((f) => filters[f] = null);
      return filters;
    }));
  }

  /**
   * @returns {string} The base path to the search page
   */
  getSearchLink() {
    return this.searchService.getSearchLink();
  }

  /**
   * Check if a given filter is supposed to be shown or not
   * @param {SearchFilterConfig} filter The filter to check for
   * @returns {Observable<boolean>} Emits true whenever a given filter config should be shown
   */
  isActive(filterConfig: SearchFilterConfig): Observable<boolean> {
    console.log('isActive', filterConfig);
    return this.filterService.getSelectedValuesForFilter(filterConfig).pipe(
      mergeMap((isActive) => {
        if (isNotEmpty(isActive)) {
          return observableOf(true);
        } else {
          return this.searchOptions$.pipe(
            switchMap((options) => {
                return this.searchService.getFacetValuesFor(filterConfig, 1, options).pipe(
                  filter((RD) => !RD.isLoading),
                  map((valuesRD) => {
                    return valuesRD.payload.totalElements > 0
                  }),)
              }
            ))
        }
      }),
      first(),
      startWith(true),);
  }

  private setLoading() {
    this.isLoadingFilters$.next(true);
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }

}
