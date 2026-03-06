import {
  BehaviorSubject,
  Observable,
  of,
} from 'rxjs';
import { SuggestionEntry } from 'src/app/shared/search/suggestion-entry.model';

import { AppliedFilter } from '../shared/search/models/applied-filter.model';
import { PaginatedSearchOptions } from '../shared/search/models/paginated-search-options.model';
import { SearchFilterConfig } from '../shared/search/models/search-filter-config.model';
import { ViewMode } from '../shared/view-mode.model';

/**
 * Stub class of {@link SearchService}
 */
export class SearchServiceStub {

  private _viewMode: ViewMode;
  private subject?: BehaviorSubject<any> = new BehaviorSubject(this.testViewMode);

  viewMode = this.subject.asObservable();

  constructor(private searchLink: string = '/search') {
    this.setViewMode(ViewMode.ListElement);
  }

  getSelectedValuesForFilter(_filterName: string): Observable<AppliedFilter[]> {
    return of([]);
  }

  getViewMode(): Observable<ViewMode> {
    return this.viewMode;
  }

  setViewMode(viewMode: ViewMode) {
    this.testViewMode = viewMode;
  }

  getFacetValuesFor(_filterConfig: SearchFilterConfig, _valuePage: number, _searchOptions?: PaginatedSearchOptions, _filterQuery?: string, _useCachedVersionIfAvailable = true) {
    return null;
  }

  getSuggestionsFor(_query: string, _dictionary: string): Observable<SuggestionEntry[]> {
    return of([]);
  }

  get testViewMode(): ViewMode {
    return this._viewMode;
  }

  set testViewMode(viewMode: ViewMode) {
    this._viewMode = viewMode;
    this.subject.next(viewMode);
  }

  getSearchLink() {
    return this.searchLink;
  }

  getFilterLabels() {
    return of([]);
  }

  search() {
    return of({});
  }
}
