import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of as observableOf, Subscription } from 'rxjs';
import { startWith, switchMap, } from 'rxjs/operators';
import { PaginatedList } from '../core/data/paginated-list';
import { RemoteData } from '../core/data/remote-data';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { pushInOut } from '../shared/animations/push';
import { HostWindowService } from '../shared/host-window.service';
import { PaginatedSearchOptions } from './paginated-search-options.model';
import { SearchResult } from './search-result.model';
import { SearchService } from './search-service/search.service';
import { SearchSidebarService } from './search-sidebar/search-sidebar.service';
import { hasValue, isNotEmpty } from '../shared/empty.util';
import { SearchConfigurationService } from './search-service/search-configuration.service';
import { getSucceededRemoteData } from '../core/shared/operators';
import { RouteService } from '../shared/services/route.service';
import { SEARCH_CONFIG_SERVICE } from '../+my-dspace-page/my-dspace-page.component';

export const SEARCH_ROUTE = '/search';

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
  animations: [pushInOut],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})

/**
 * This component represents the whole search page
 * It renders search results depending on the current search options
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
   * Subscription to unsubscribe from
   */
  sub: Subscription;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch = true;

  /**
   * Whether or not the search bar should be visible
   */
  @Input()
  searchEnabled = true;

  /**
   * The width of the sidebar (bootstrap columns)
   */
  @Input()
  sideBarWidth = 3;

  /**
   * The currently applied filter (determines title of search)
   */
  @Input()
  fixedFilter$: Observable<string>;

  constructor(protected service: SearchService,
              protected sidebarService: SearchSidebarService,
              protected windowService: HostWindowService,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
              protected routeService: RouteService) {
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
    this.searchOptions$ = this.getSearchOptions();
    this.sub = this.searchOptions$.pipe(
      switchMap((options) => this.service.search(options).pipe(getSucceededRemoteData(), startWith(observableOf(undefined)))))
      .subscribe((results) => {
        this.resultsRD$.next(results);
      });
    this.scopeListRD$ = this.searchConfigService.getCurrentScope('').pipe(
      switchMap((scopeId) => this.service.getScopes(scopeId))
    );
    if (!isNotEmpty(this.fixedFilter$)) {
      this.fixedFilter$ = this.routeService.getRouteParameterValue('filter');
    }
  }

  /**
   * Get the current paginated search options
   * @returns {Observable<PaginatedSearchOptions>}
   */
  protected getSearchOptions(): Observable<PaginatedSearchOptions> {
    return this.searchConfigService.paginatedSearchOptions;
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
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  public getSearchLink(): string {
    if (this.inPlaceSearch) {
      return './';
    }
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
