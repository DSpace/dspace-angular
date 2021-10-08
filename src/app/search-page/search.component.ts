import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { PaginatedList } from '../core/data/paginated-list.model';
import { RemoteData } from '../core/data/remote-data';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { pushInOut } from '../shared/animations/push';
import { HostWindowService } from '../shared/host-window.service';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { hasValue, isEmpty } from '../shared/empty.util';
import { getFirstSucceededRemoteData } from '../core/shared/operators';
import { RouteService } from '../core/services/route.service';
import { SEARCH_CONFIG_SERVICE } from '../my-dspace-page/my-dspace-page.component';
import { PaginatedSearchOptions } from '../shared/search/paginated-search-options.model';
import { SearchResult } from '../shared/search/search-result.model';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { SearchService } from '../core/shared/search/search.service';
import { currentPath } from '../shared/utils/route.utils';
import { Router } from '@angular/router';
import { Context } from '../core/shared/context.model';
import { SortOptions } from '../core/cache/models/sort-options.model';
import { followLink } from '../shared/utils/follow-link-config.model';
import { Item } from '../core/shared/item.model';

@Component({
  selector: 'ds-search',
  styleUrls: ['./search.component.scss'],
  templateUrl: './search.component.html',
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
 * This component renders a sidebar, a search input bar and the search results.
 */
export class SearchComponent implements OnInit {
  /**
   * The current search results
   */
  resultsRD$: BehaviorSubject<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> = new BehaviorSubject(null);

  /**
   * The current paginated search options
   */
  searchOptions$: Observable<PaginatedSearchOptions>;

  /**
   * The current available sort options
   */
  sortOptions$: Observable<SortOptions[]>;

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
   * The currently applied configuration (determines title of search)
   */
  @Input()
  configuration$: Observable<string>;

  /**
   * The current context
   */
  @Input()
  context: Context;

  /**
   * Link to the search page
   */
  searchLink: string;

  /**
   * Observable for whether or not the sidebar is currently collapsed
   */
  isSidebarCollapsed$: Observable<boolean>;

  constructor(protected service: SearchService,
              protected sidebarService: SidebarService,
              protected windowService: HostWindowService,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
              protected routeService: RouteService,
              protected router: Router) {
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
    this.isSidebarCollapsed$ = this.isSidebarCollapsed();
    this.searchLink = this.getSearchLink();
    this.searchOptions$ = this.getSearchOptions();
    this.sub = this.searchOptions$.pipe(
      switchMap((options) => this.service.search(
          options, undefined, true, true, followLink<Item>('thumbnail', { isOptional: true })
        ).pipe(getFirstSucceededRemoteData(), startWith(undefined))
      )
    ).subscribe((results) => {
        this.resultsRD$.next(results);
      });

    if (isEmpty(this.configuration$)) {
      this.configuration$ = this.searchConfigService.getCurrentConfiguration('default');
    }

    const searchConfig$ = this.searchConfigService.getConfigurationSearchConfigObservable(this.configuration$, this.service);

    this.sortOptions$ = this.searchConfigService.getConfigurationSortOptionsObservable(searchConfig$);
    this.searchConfigService.initializeSortOptionsFromConfiguration(searchConfig$);

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
    this.sidebarService.collapse();
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
  private isSidebarCollapsed(): Observable<boolean> {
    return this.sidebarService.isCollapsed;
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  private getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
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
