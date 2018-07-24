import { Component, Inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FacetValue } from '../../../search-service/facet-value.model';
import { SearchFilterConfig } from '../../../search-service/search-filter-config.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FILTER_CONFIG, SearchFilterService } from '../search-filter.service';
import { hasNoValue, hasValue, isNotEmpty } from '../../../../shared/empty.util';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { SearchService } from '../../../search-service/search.service';
import { SearchOptions } from '../../../search-options.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { EmphasizePipe } from '../../../../shared/utils/emphasize.pipe';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-facet-filter',
  template: ``,
})

export class SearchFacetFilterComponent implements OnInit, OnDestroy {
  filterValues: Array<Observable<RemoteData<PaginatedList<FacetValue>>>> = [];
  filterValues$: BehaviorSubject<any> = new BehaviorSubject(this.filterValues);
  currentPage: Observable<number>;
  isLastPage$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  filter: string;
  pageChange = false;
  sub: Subscription;
  filterSearchResults: Observable<any[]> = Observable.of([]);
  selectedValues: Observable<string[]>;

  constructor(protected searchService: SearchService,
              protected filterService: SearchFilterService,
              protected router: Router,
              @Inject(FILTER_CONFIG) public filterConfig: SearchFilterConfig) {
  }

  ngOnInit(): void {
    this.currentPage = this.getCurrentPage().distinctUntilChanged();
    this.selectedValues = this.filterService.getSelectedValuesForFilter(this.filterConfig);
    const searchOptions = this.filterService.getSearchOptions().distinctUntilChanged();
    searchOptions.subscribe((options) => this.updateFilterValueList(options));
    const facetValues = Observable.combineLatest(searchOptions, this.currentPage, (options, page) => {
      return {values: this.searchService.getFacetValuesFor(this.filterConfig, page, options), page: page};
    });
    facetValues.subscribe((facetOutcome) => {
      const newValues$ = facetOutcome.values;

      if (facetOutcome.page > 1) {
        this.filterValues = [...this.filterValues, newValues$];
      } else {
        this.filterValues = [newValues$]
      }

      this.filterValues$.next(this.filterValues);
      newValues$.first().subscribe((rd) => {
        this.isLastPage$.next(hasNoValue(rd.payload.next))
      });
    });
  }

  updateFilterValueList(options: SearchOptions) {
    // this.unsubscribe();
    this.showFirstPageOnly();
    this.filter = '';
  }

  isChecked(value: FacetValue): Observable<boolean> {
    return this.filterService.isFilterActiveWithValue(this.filterConfig.paramName, value.value);
  }

  getSearchLink() {
    return this.searchService.getSearchLink();
  }

  showMore() {
    this.filterService.incrementPage(this.filterConfig.name);
  }

  showFirstPageOnly() {
    // this.filterValues = [];
    this.filterService.resetPage(this.filterConfig.name);
  }

  getCurrentPage(): Observable<number> {
    return this.filterService.getPage(this.filterConfig.name);
  }

  getCurrentUrl() {
    return this.router.url;
  }

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

  hasValue(o: any): boolean {
    return hasValue(o);
  }

  getRemoveParams(value: string): Observable<any> {
    return this.selectedValues.map((selectedValues) => {
      return {
        [this.filterConfig.paramName]: selectedValues.filter((v) => v !== value),
        page: 1
      };
    });
  }

  getAddParams(value: string): Observable<any> {
    return this.selectedValues.map((selectedValues) => {
      return {
        [this.filterConfig.paramName]: [...selectedValues, value],
        page: 1
      };
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  unsubscribe(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }

  findSuggestions(data): void {
    if (isNotEmpty(data)) {
      this.filterService.getSearchOptions().first().subscribe(
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

  getDisplayValue(facet: FacetValue, query: string): string {
    return new EmphasizePipe().transform(facet.value, query) + ' (' + facet.count + ')';
  }
}
