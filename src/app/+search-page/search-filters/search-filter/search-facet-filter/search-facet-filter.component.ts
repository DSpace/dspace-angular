import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit, QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { FacetValue } from '../../../search-service/facet-value.model';
import { SearchFilterConfig } from '../../../search-service/search-filter-config.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SearchFilterService } from '../search-filter.service';
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
  styleUrls: ['./search-facet-filter.component.scss'],
  templateUrl: './search-facet-filter.component.html'
})

export class SearchFacetFilterComponent implements OnInit, OnDestroy {
  @Input() filterConfig: SearchFilterConfig;
  @Input() selectedValues: string[];
  filterValues: Array<Observable<RemoteData<PaginatedList<FacetValue>>>> = [];
  filterValues$: BehaviorSubject<any> = new BehaviorSubject(this.filterValues);
  currentPage: Observable<number>;
  isLastPage$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  filter: string;
  pageChange = false;
  sub: Subscription;
  filterSearchResults: Observable<string[]> = Observable.of([]);

  constructor(private searchService: SearchService, private filterService: SearchFilterService, private router: Router) {
  }

  ngOnInit(): void {
    this.currentPage = this.getCurrentPage();
    this.currentPage.distinctUntilChanged().subscribe((page) => this.pageChange = true);
    this.filterService.getSearchOptions().distinctUntilChanged().subscribe((options) => this.updateFilterValueList(options));
  }

  updateFilterValueList(options: SearchOptions) {
    if (!this.pageChange) {
      this.showFirstPageOnly();
    }
    this.pageChange = false;

    this.unsubscribe();
    this.sub = this.currentPage.distinctUntilChanged().map((page) => {
      return this.searchService.getFacetValuesFor(this.filterConfig, page, options);
    }).subscribe((newValues$) => {
      this.filterValues = [...this.filterValues, newValues$];
      this.filterValues$.next(this.filterValues);
      newValues$.first().subscribe((rd) => this.isLastPage$.next(hasNoValue(rd.payload.next)));
    });
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
    this.filterValues = [];
    this.filterService.resetPage(this.filterConfig.name);
  }

  getCurrentPage(): Observable<number> {
    return this.filterService.getPage(this.filterConfig.name);
  }

  getCurrentUrl() {
    return this.router.url;
  }

  onSubmit(data: any) {
    if (isNotEmpty(data)) {
      this.router.navigate([this.getSearchLink()], {
        queryParams:
          { [this.filterConfig.paramName]: [...this.selectedValues, data] },
        queryParamsHandling: 'merge'
      });
      this.filter = '';
    }
    this.filterSearchResults = Observable.of([]);
  }

  hasValue(o: any): boolean {
    return hasValue(o);
  }

  getRemoveParams(value: string) {
    return {
      [this.filterConfig.paramName]: this.selectedValues.filter((v) => v !== value),
      page: 1
    };
  }

  getAddParams(value: string) {
    return {
      [this.filterConfig.paramName]: [...this.selectedValues, value],
      page: 1
    };
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
                return rd.payload.page.map((facet) => facet.value)
              }
            );
        }
      )
    } else {
      this.filterSearchResults = Observable.of([]);
    }
  }

  getDisplayValue(value: string, searchValue: string) {
    return new EmphasizePipe().transform(value, searchValue);
  }
}
