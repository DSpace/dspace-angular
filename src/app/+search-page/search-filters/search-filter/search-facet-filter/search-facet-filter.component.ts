import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { RemoteDataBuildService } from '../../../../core/cache/builders/remote-data-build.service';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { RemoteData } from '../../../../core/data/remote-data';
import { hasNoValue, hasValue, isNotEmpty } from '../../../../shared/empty.util';
import { EmphasizePipe } from '../../../../shared/utils/emphasize.pipe';
import { SearchOptions } from '../../../search-options.model';
import { FacetValue } from '../../../search-service/facet-value.model';
import { SearchFilterConfig } from '../../../search-service/search-filter-config.model';
import { SearchService } from '../../../search-service/search.service';
import { FILTER_CONFIG, SearchFilterService } from '../search-filter.service';
import { SearchConfigurationService } from '../../../search-service/search-configuration.service';

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
  filterValues$: Subject<RemoteData<Array<PaginatedList<FacetValue>>>>;

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
  private subs: Subscription[] = [];

  /**
   * Emits the result values for this filter found by the current filter query
   */
  filterSearchResults: Observable<any[]> = Observable.of([]);

  /**
   * Emits the active values for this filter
   */
  selectedValues: Observable<string[]>;
  private collapseNextUpdate = true;

  /**
   * State of the requested facets used to time the animation
   */
  animationState = 'loading';

  constructor(protected searchService: SearchService,
              protected filterService: SearchFilterService,
              protected searchConfigService: SearchConfigurationService,
              protected rdbs: RemoteDataBuildService,
              protected router: Router,
              @Inject(FILTER_CONFIG) public filterConfig: SearchFilterConfig) {
  }

  /**
   * Initializes all observable instance variables and starts listening to them
   */
  ngOnInit(): void {
    this.filterValues$ = new BehaviorSubject(new RemoteData(true, false, undefined, undefined, undefined));
    this.currentPage = this.getCurrentPage().distinctUntilChanged();
    this.selectedValues = this.filterService.getSelectedValuesForFilter(this.filterConfig);
    const searchOptions = this.searchConfigService.searchOptions;
    this.subs.push(this.searchConfigService.searchOptions.subscribe(() => this.updateFilterValueList()));
    const facetValues = Observable.combineLatest(searchOptions, this.currentPage, (options, page) => {
      return { options, page }
    }).switchMap(({ options, page }) => {
      return this.searchService.getFacetValuesFor(this.filterConfig, page, options).map((results) => {
          return {
            values: Observable.of(results),
            page: page
          };
        }
      );
    });
    let filterValues = [];
    this.subs.push(facetValues.subscribe((facetOutcome) => {
      const newValues$ = facetOutcome.values;

      if (this.collapseNextUpdate) {
        this.showFirstPageOnly();
        facetOutcome.page = 1;
        this.collapseNextUpdate = false;
      }
      if (facetOutcome.page === 1) {
        filterValues = [];
      }

      filterValues = [...filterValues, newValues$];

      this.subs.push(this.rdbs.aggregate(filterValues).subscribe((rd: RemoteData<Array<PaginatedList<FacetValue>>>) => {
        this.animationState = 'ready';
        this.filterValues$.next(rd);
      }));
      this.subs.push(newValues$.first().subscribe((rd) => {
        this.isLastPage$.next(hasNoValue(rd.payload.next))
      }));
    }));

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
   * Checks if a value for this filter is currently active
   */
  isChecked(value: FacetValue): Observable<boolean> {
    return this.filterService.isFilterActiveWithValue(this.filterConfig.paramName, value.value);
  }

  /**
   * @returns {string} The base path to the search page
   */
  getSearchLink() {
    return this.searchService.getSearchLink();
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
   * @returns {string} the current URL
   */
  getCurrentUrl() {
    return this.router.url;
  }

  /**
   * Submits a new active custom value to the filter from the input field
   * @param data The string from the input field
   */
  onSubmit(data: any) {
    this.selectedValues.first().subscribe((selectedValues) => {
        if (isNotEmpty(data)) {
          this.router.navigate([this.getSearchLink()], {
            queryParams:
              { [this.filterConfig.paramName]: [...selectedValues, data] },
            queryParamsHandling: 'merge'
          });
          this.filter = '';
        }
        this.filterSearchResults = Observable.of([]);
      }
    )
  }

  onClick(data: any) {
    this.filter = data;
  }

  /**
   * For usage of the hasValue function in the template
   */
  hasValue(o: any): boolean {
    return hasValue(o);
  }

  /**
   * Calculates the parameters that should change if a given value for this filter would be removed from the active filters
   * @param {string} value The value that is removed for this filter
   * @returns {Observable<any>} The changed filter parameters
   */
  getRemoveParams(value: string): Observable<any> {
    return this.selectedValues.map((selectedValues) => {
      return {
        [this.filterConfig.paramName]: selectedValues.filter((v) => v !== value),
        page: 1
      };
    });
  }

  /**
   * Calculates the parameters that should change if a given value for this filter would be added to the active filters
   * @param {string} value The value that is added for this filter
   * @returns {Observable<any>} The changed filter parameters
   */
  getAddParams(value: string): Observable<any> {
    return this.selectedValues.map((selectedValues) => {
      return {
        [this.filterConfig.paramName]: [...selectedValues, value],
        page: 1
      };
    });
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

  /**
   * Updates the found facet value suggestions for a given query
   * Transforms the found values into display values
   * @param data The query for which is being searched
   */
  findSuggestions(data): void {
    if (isNotEmpty(data)) {
      this.searchConfigService.searchOptions.first().subscribe(
        (options) => {
          this.filterSearchResults = this.searchService.getFacetValuesFor(this.filterConfig, 1, options, data.toLowerCase())
            .first()
            .map(
              (rd: RemoteData<PaginatedList<FacetValue>>) => {
                return rd.payload.page.map((facet) => {
                  return { displayValue: this.getDisplayValue(facet, data), value: facet.value }
                })
              }
            );
        }
      )
    } else {
      this.filterSearchResults = Observable.of([]);
    }
  }

  /**
   * Transforms the facet value string, so if the query matches part of the value, it's emphasized in the value
   * @param {FacetValue} facet The value of the facet as returned by the server
   * @param {string} query The query that was used to search facet values
   * @returns {string} The facet value with the query part emphasized
   */
  getDisplayValue(facet: FacetValue, query: string): string {
    return new EmphasizePipe().transform(facet.value, query) + ' (' + facet.count + ')';
  }
}

export const facetLoad = trigger('facetLoad', [
  state('ready', style({ opacity: 1 })),
  state('loading', style({ opacity: 0 })),
  transition('loading <=> ready', animate(100)),
]);
