import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnDestroy, OnInit, EventEmitter } from '@angular/core';
import { Router, Params } from '@angular/router';

import { BehaviorSubject, combineLatest as observableCombineLatest, Observable, of as observableOf, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';

import { RemoteDataBuildService } from '../../../../../core/cache/builders/remote-data-build.service';
import { hasNoValue, hasValue } from '../../../../empty.util';
import { FacetValue } from '../../../models/facet-value.model';
import { SearchFilterConfig } from '../../../models/search-filter-config.model';
import { SearchService } from '../../../../../core/shared/search/search.service';
import { FILTER_CONFIG, IN_PLACE_SEARCH, REFRESH_FILTER, SearchFilterService, CHANGE_APPLIED_FILTERS } from '../../../../../core/shared/search/search-filter.service';
import { SearchConfigurationService } from '../../../../../core/shared/search/search-configuration.service';
import { getFirstSucceededRemoteDataPayload } from '../../../../../core/shared/operators';
import { InputSuggestion } from '../../../../input-suggestions/input-suggestions.model';
import { SearchOptions } from '../../../models/search-options.model';
import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-page.component';
import { currentPath } from '../../../../utils/route.utils';
import { stripOperatorFromFilterValue } from '../../../search.utils';
import { FacetValues } from '../../../models/facet-values.model';
import { AppliedFilter } from '../../../models/applied-filter.model';

@Component({
  selector: 'ds-search-facet-filter',
  template: ``,
})

/**
 * Super class for all different representations of facets
 */
export class SearchFacetFilterComponent implements OnInit, OnDestroy {
  /**
   * Emits an array of pages with values found for this facet
   */
  facetValues$: BehaviorSubject<FacetValues[]> = new BehaviorSubject([]);

  /**
   * Emits the current last shown page of this facet's values
   */
  currentPage: Observable<number>;

  /**
   * Emits true if the current page is also the last page available
   */
  isLastPage$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * The value of the input field that is used to query for possible values for this filter
   */
  filter: string;

  /**
   * List of subscriptions to unsubscribe from
   */
  protected subs: Subscription[] = [];

  /**
   * Emits the result values for this filter found by the current filter query
   */
  filterSearchResults$: Observable<InputSuggestion[]> = observableOf([]);

  /**
   * Emits the active values for this filter
   */
  selectedAppliedFilters$: Observable<AppliedFilter[]>;

  protected collapseNextUpdate = true;

  /**
   * State of the requested facets used to time the animation
   */
  animationState = 'loading';

  /**
   * Emits all current search options available in the search URL
   */
  searchOptions$: BehaviorSubject<SearchOptions>;

  /**
   * The current URL
   */
  currentUrl: string;

  constructor(protected searchService: SearchService,
              protected filterService: SearchFilterService,
              protected rdbs: RemoteDataBuildService,
              protected router: Router,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
              @Inject(IN_PLACE_SEARCH) public inPlaceSearch: boolean,
              @Inject(FILTER_CONFIG) public filterConfig: SearchFilterConfig,
              @Inject(REFRESH_FILTER) public refreshFilters: BehaviorSubject<boolean>,
              @Inject(CHANGE_APPLIED_FILTERS) public changeAppliedFilters: EventEmitter<AppliedFilter[]>,
  ) {
  }

  /**
   * Initializes all observable instance variables and starts listening to them
   */
  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.currentPage = this.getCurrentPage().pipe(distinctUntilChanged());

    this.searchOptions$ = this.searchConfigService.searchOptions;
    this.subs.push(
      this.searchOptions$.subscribe(() => this.updateFilterValueList()),
      this.refreshFilters.asObservable().pipe(
        filter((toRefresh: boolean) => toRefresh),
        // NOTE This is a workaround, otherwise retrieving filter values returns tha old cached response
        debounceTime((100)),
        mergeMap(() => this.retrieveFilterValues(false))
      ).subscribe()
    );
    this.retrieveFilterValues().subscribe();
  }

  /**
   * Prepare for refreshing the values of this filter
   */
  updateFilterValueList() {
    this.animationState = 'loading';
    this.collapseNextUpdate = true;
    this.filter = '';
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  public getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
    }
    return this.searchService.getSearchLink();
  }

  /**
   * @returns {string[]} The base path to the search page, or the current page when inPlaceSearch is true, split in separate pieces
   */
  public getSearchLinkParts(): string[] {
    if (this.inPlaceSearch) {
      return [];
    }
    return this.getSearchLink().split('/');
  }

  /**
   * Show the next page as well
   */
  showMore() {
    this.filterService.incrementPage(this.filterConfig.name);
  }

  /**
   * Make sure only the first page is shown
   */
  showFirstPageOnly() {
    this.filterService.resetPage(this.filterConfig.name);
  }

  /**
   * @returns {Observable<number>} The current page of this filter
   */
  getCurrentPage(): Observable<number> {
    return this.filterService.getPage(this.filterConfig.name);
  }

  /**
   * Submits a new active custom value to the filter from the input field when the input field isn't empty.
   * @param data The string from the input field
   */
  onSubmit(data: any) {
    this.applyFilterValue(data);
  }

  /**
   * Submits a selected filter value to the filter
   * Take the query from the InputSuggestion object
   * @param data The input suggestion selected
   */
  onClick(data: InputSuggestion) {
    this.applyFilterValue(data.query);
  }

  /**
   * For usage of the hasValue function in the template
   */
  hasValue(o: any): boolean {
    return hasValue(o);
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

  findSuggestions(query: string): void {
    this.filterSearchResults$ = this.filterService.findSuggestions(this.filterConfig, this.searchOptions$.value, query);
  }

  /**
   * Build the filter query using the value given and apply to the search.
   * @param data The string from the input field (containing operator)
   */
  protected applyFilterValue(data: string): void {
    if (data.match(new RegExp(`^.+,(equals|query|authority)$`))) {
      const valueParts = data.split(',');
      this.subs.push(this.searchConfigService.selectNewAppliedFilterParams(this.filterConfig.name, valueParts.slice(0, valueParts.length - 1).join(), valueParts[valueParts.length - 1]).pipe(take(1)).subscribe((params: Params) => {
        void this.router.navigate(this.getSearchLinkParts(), {
          queryParams: params,
        });
        this.filter = '';
        this.filterSearchResults$ = observableOf([]);
      }));
    }
  }

  protected retrieveFilterValues(useCachedVersionIfAvailable = true): Observable<FacetValues[]> {
    return observableCombineLatest([this.searchOptions$, this.currentPage]).pipe(
      switchMap(([options, page]: [SearchOptions, number]) => this.searchService.getFacetValuesFor(this.filterConfig, page, options, null, useCachedVersionIfAvailable).pipe(
        getFirstSucceededRemoteDataPayload(),
        tap((facetValues: FacetValues) => {
          this.isLastPage$.next(hasNoValue(facetValues?.next));
        }),
      )),
      map((newFacetValues: FacetValues) => {
        let filterValues: FacetValues[] = this.facetValues$.value;

        if (this.collapseNextUpdate) {
          this.showFirstPageOnly();
          filterValues = [];
          this.collapseNextUpdate = false;
        }
        if (newFacetValues.pageInfo.currentPage === 1) {
          filterValues = [];
        }

        filterValues = [...filterValues, newFacetValues];

        return filterValues;
      }),
      tap((allFacetValues: FacetValues[]) => {
        this.setAppliedFilter(allFacetValues);
        this.animationState = 'ready';
        this.facetValues$.next(allFacetValues);
      })
    );
  }

  setAppliedFilter(allFacetValues: FacetValues[]): void {
    const allAppliedFilters: AppliedFilter[] = [].concat(...allFacetValues.map((facetValues: FacetValues) => facetValues.appliedFilters))
      .filter((appliedFilter: AppliedFilter) => hasValue(appliedFilter));

    this.selectedAppliedFilters$ = this.filterService.getSelectedValuesForFilter(this.filterConfig).pipe(
      map((selectedValues: string[]) => {
        const appliedFilters: AppliedFilter[] = selectedValues.map((value: string) => {
          return allAppliedFilters.find((appliedFilter: AppliedFilter) => appliedFilter.value === stripOperatorFromFilterValue(value));
        }).filter((appliedFilter: AppliedFilter) => hasValue(appliedFilter));
        this.changeAppliedFilters.emit(appliedFilters);
        return appliedFilters;
      }),
    );
  }

  /**
   * Prevent unnecessary rerendering
   */
  trackUpdate(index, value: FacetValue) {
    return value ? value._links.search.href : undefined;
  }
}

export const facetLoad = trigger('facetLoad', [
  state('ready', style({ opacity: 1 })),
  state('loading', style({ opacity: 0 })),
  transition('loading <=> ready', animate(100)),
]);
