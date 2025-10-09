import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  Params,
  Router,
} from '@angular/router';
import {
  BehaviorSubject,
  combineLatest as observableCombineLatest,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  distinctUntilChanged,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { RemoteDataBuildService } from '../../../../../core/cache/builders/remote-data-build.service';
import { getFirstSucceededRemoteDataPayload } from '../../../../../core/shared/operators';
import { SearchService } from '../../../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../../../core/shared/search/search-configuration.service';
import { SearchFilterService } from '../../../../../core/shared/search/search-filter.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-configuration.service';
import {
  hasNoValue,
  hasValue,
} from '../../../../empty.util';
import { InputSuggestion } from '../../../../input-suggestions/input-suggestions.model';
import { currentPath } from '../../../../utils/route.utils';
import { AppliedFilter } from '../../../models/applied-filter.model';
import { FacetValue } from '../../../models/facet-value.model';
import { FacetValues } from '../../../models/facet-values.model';
import { SearchFilterConfig } from '../../../models/search-filter-config.model';
import { SearchOptions } from '../../../models/search-options.model';

/**
 * The operators the {@link AppliedFilter} should have in order to be shown in the facets
 */
export const FACET_OPERATORS: string[] = [
  'equals',
  'authority',
  'range',
];

@Component({
  selector: 'ds-search-facet-filter',
  template: ``,
  standalone: true,
})

/**
 * Super class for all different representations of facets
 */
export class SearchFacetFilterComponent implements OnInit, OnDestroy {

  /**
   * Configuration for the filter of this wrapper component
   */
  @Input() filterConfig: SearchFilterConfig;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch: boolean;

  /**
   * Emits when the search filters values may be stale, and so they must be refreshed.
   */
  @Input() refreshFilters: BehaviorSubject<boolean>;

  /**
   * The current scope
   */
  @Input() scope: string;

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
   * Emits true if show the search text
   */
  isAvailableForShowSearchText: BehaviorSubject<boolean> = new BehaviorSubject(false);
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
  filterSearchResults$: Observable<InputSuggestion[]> = of([]);

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
  searchOptions$: Observable<SearchOptions>;

  /**
   * The current URL
   */
  currentUrl: string;

  constructor(protected searchService: SearchService,
              protected filterService: SearchFilterService,
              protected rdbs: RemoteDataBuildService,
              protected router: Router,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
  ) {
  }

  /**
   * Initializes all observable instance variables and starts listening to them
   */
  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.currentPage = this.getCurrentPage().pipe(distinctUntilChanged());
    this.searchOptions$ = this.searchConfigService.searchOptions.pipe(
      map((options: SearchOptions) => hasNoValue(this.scope) ? options : Object.assign(new SearchOptions(options), {
        scope: this.scope,
      })),
    );
    this.subs.push(
      this.searchOptions$.subscribe(() => this.updateFilterValueList()),
      this.retrieveFilterValues().subscribe(),
    );
    this.selectedAppliedFilters$ = this.searchService.getSelectedValuesForFilter(this.filterConfig.name).pipe(
      map((allAppliedFilters: AppliedFilter[]) => allAppliedFilters.filter((appliedFilter: AppliedFilter) => FACET_OPERATORS.includes(appliedFilter.operator))),
      distinctUntilChanged((previous: AppliedFilter[], next: AppliedFilter[]) => JSON.stringify(previous) === JSON.stringify(next)),
    );
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
    this.subs.push(this.searchOptions$.pipe(
      take(1),
    ).subscribe((searchOptions: SearchOptions) => {
      this.filterSearchResults$ = this.filterService.findSuggestions(this.filterConfig, searchOptions, query);
    }));
  }

  /**
   * Build the filter query using the value given and apply to the search.
   * @param data The string from the input field (containing operator)
   */
  protected applyFilterValue(data: string): void {
    if (data.match(new RegExp(`^.+,(equals|query|authority)$`))) {
      this.filterService.minimizeAll();
      const valueParts = data.split(',');
      this.subs.push(this.searchConfigService.selectNewAppliedFilterParams(this.filterConfig.name, valueParts.slice(0, valueParts.length - 1).join(), valueParts[valueParts.length - 1]).pipe(take(1)).subscribe((params: Params) => {
        void this.router.navigate(this.getSearchLinkParts(), {
          queryParams: params,
        });
        this.filter = '';
        this.filterSearchResults$ = of([]);
      }));
    }
  }

  /**
   * Retrieves all the filter value suggestion pages that need to be displayed in the facet and combines it into one
   * list.
   */
  protected retrieveFilterValues(): Observable<FacetValues[]> {
    return observableCombineLatest([this.searchOptions$, this.currentPage]).pipe(
      switchMap(([options, page]: [SearchOptions, number]) => this.searchService.getFacetValuesFor(this.filterConfig, page, options).pipe(
        getFirstSucceededRemoteDataPayload(),
        tap((facetValues: FacetValues) => {
          this.isLastPage$.next(hasNoValue(facetValues?.next));
          const hasLimitFacets =  facetValues?.page?.length < facetValues?.facetLimit;
          this.isAvailableForShowSearchText.next(hasLimitFacets && hasNoValue(facetValues?.next));
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
        this.animationState = 'ready';
        this.facetValues$.next(allFacetValues);
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
