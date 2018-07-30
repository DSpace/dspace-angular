import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { flatMap, } from 'rxjs/operators';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { PaginatedList } from '../core/data/paginated-list';
import { RemoteData } from '../core/data/remote-data';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { pushInOut } from '../shared/animations/push';
import { HostWindowService } from '../shared/host-window.service';
import { PaginatedSearchOptions } from './paginated-search-options.model';
import { SearchFilterService } from './search-filters/search-filter/search-filter.service';
import { SearchResult } from './search-result.model';
import { SearchService } from './search-service/search.service';
import { SearchSidebarService } from './search-sidebar/search-sidebar.service';
import { Subscription } from 'rxjs/Subscription';
import { hasValue } from '../shared/empty.util';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-page',
  styleUrls: ['./search-page.component.scss'],
  templateUrl: './search-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [pushInOut]
})

/**
 * This component represents the whole search page
 */
export class SearchPageComponent implements OnInit {

  /**
   * The current search results
   */
  resultsRD$: BehaviorSubject<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> = new BehaviorSubject(null);

  /**
   * The current paginated search options
   */
  searchOptions$: Observable<PaginatedSearchOptions>;

  /**
   * The current relevant scopes
   */
  scopeListRD$: Observable<DSpaceObject[]>;

  /**
   * Emits true if were on a small screen
   */
  isXsOrSm$: Observable<boolean>;

  /**
   * Default values for the Search Options
   */
  defaults = {
    pagination: {
      id: 'search-results-pagination',
      pageSize: 10
    },
    sort: new SortOptions('score', SortDirection.DESC),
    query: '',
    scope: ''
  };

  /**
   * Subscription to unsubscribe from
   */
  sub: Subscription;

  constructor(private service: SearchService,
              private sidebarService: SearchSidebarService,
              private windowService: HostWindowService,
              private filterService: SearchFilterService) {
    this.isXsOrSm$ = this.windowService.isXsOrSm();
  }

  /**
   * Listening to changes in the paginated search options
   * If something changes, update the search results
   *
   * Listen to changes in the scope
   * If something changes, update the list of scopes for the dropdown
   */
  ngOnInit(): void {
    this.searchOptions$ = this.filterService.getPaginatedSearchOptions(this.defaults);
    this.sub = this.searchOptions$.subscribe((searchOptions) =>
      this.service.search(searchOptions).filter((rd) => !rd.isLoading).first().subscribe((results) => this.resultsRD$.next(results)));

    this.scopeListRD$ = this.filterService.getCurrentScope().pipe(
      flatMap((scopeId) => this.service.getScopes(scopeId))
    );
  }

  /**
   * Set the sidebar to a collapsed state
   */
  public closeSidebar(): void {
    this.sidebarService.collapse()
  }

  /**
   * Set the sidebar to an expanded state
   */
  public openSidebar(): void {
    this.sidebarService.expand();
  }

  /**
   * Check if the sidebar is collapsed
   * @returns {Observable<boolean>} emits true if the sidebar is currently collapsed, false if it is expanded
   */
  public isSidebarCollapsed(): Observable<boolean> {
    return this.sidebarService.isCollapsed;
  }

  /**
   * @returns {string} The base path to the search page
   */
  public getSearchLink(): string {
    return this.service.getSearchLink();
  }

  /**
   * Unsubscribe from the subscription
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
