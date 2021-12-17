import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { uniqueId } from 'lodash';

import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { pushInOut } from '../animations/push';
import { HostWindowService } from '../host-window.service';
import { SidebarService } from '../sidebar/sidebar.service';
import { hasValue } from '../empty.util';
import { RouteService } from '../../core/services/route.service';
import { SEARCH_CONFIG_SERVICE } from '../../my-dspace-page/my-dspace-page.component';
import { PaginatedSearchOptions } from './models/paginated-search-options.model';
import { SearchResult } from './models/search-result.model';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { SearchService } from '../../core/shared/search/search.service';
import { currentPath } from '../utils/route.utils';
import { Context } from '../../core/shared/context.model';
import { SortOptions } from '../../core/cache/models/sort-options.model';
import { SearchConfig } from '../../core/shared/search/search-filters/search-config.model';
import { SearchConfigurationOption } from './search-switch-configuration/search-configuration-option.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { followLink } from '../utils/follow-link-config.model';
import { Item } from '../../core/shared/item.model';
import { SearchObjects } from './models/search-objects.model';
import { ViewMode } from '../../core/shared/view-mode.model';

@Component({
  selector: 'ds-search',
  styleUrls: ['./search.component.scss'],
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [pushInOut],
})

/**
 * This component renders a sidebar, a search input bar and the search results.
 */
export class SearchComponent implements OnInit {

  /**
   * The list of available configuration options
   */
  @Input() configurationList: SearchConfigurationOption[] = [];

  /**
   * The current context
   * If empty, 'search' is used
   */
  @Input() context: Context = Context.Search;

  /**
   * The configuration to use for the search options
   * If empty, 'default' is used
   */
  @Input() configuration = 'default';

  /**
   * The actual query for the fixed filter.
   * If empty, the query will be determined by the route parameter called 'filter'
   */
  @Input() fixedFilterQuery: string;

  /**
   * If this is true, the request will only be sent if there's
   * no valid cached version. Defaults to true
   */
  @Input() useCachedVersionIfAvailable = true;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch = true;

  /**
   * The pagination id used in the search
   */
  @Input() paginationId = 'spc';

  /**
   * Whether or not the search bar should be visible
   */
  @Input() searchEnabled = true;

  /**
   * The width of the sidebar (bootstrap columns)
   */
  @Input() sideBarWidth = 3;

  /**
   * A boolean representing if show search sidebar button
   */
  @Input() showSidebar = true;

  /**
   * List of available view mode
   */
  @Input() viewModeList: ViewMode[];

  /**
   * The current configuration used during the search
   */
  currentConfiguration$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * The current context used during the search
   */
  currentContext$: BehaviorSubject<Context> = new BehaviorSubject<Context>(null);

  /**
   * The current search results
   */
  resultsRD$: BehaviorSubject<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> = new BehaviorSubject(null);

  /**
   * The current paginated search options
   */
  searchOptions$: BehaviorSubject<PaginatedSearchOptions> = new BehaviorSubject<PaginatedSearchOptions>(null);

  /**
   * The available sort options list
   */
  sortOptionsList$: BehaviorSubject<SortOptions[]> = new BehaviorSubject<SortOptions[]>([]);

  /**
   * The current sort options used
   */
  currentSortOptions$: BehaviorSubject<SortOptions> = new BehaviorSubject<SortOptions>(null);

  /**
   * Observable for whether or not the sidebar is currently collapsed
   */
  isSidebarCollapsed$: Observable<boolean>;

  /**
   * Emits true if were on a small screen
   */
  isXsOrSm$: Observable<boolean>;

  /**
   * Link to the search page
   */
  searchLink: string;

  /**
   * Subscription to unsubscribe from
   */
  sub: Subscription;

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
    // Create an unique pagination id related to the instance of the SearchComponent
    this.paginationId = uniqueId(this.paginationId);
    this.searchConfigService.setPaginationId(this.paginationId);

    if (hasValue(this.fixedFilterQuery)) {
      this.routeService.setParameter('fixedFilterQuery', this.fixedFilterQuery);
    }

    this.isSidebarCollapsed$ = this.isSidebarCollapsed();
    this.searchLink = this.getSearchLink();
    this.currentContext$.next(this.context);

    // Determinate PaginatedSearchOptions and listen to any update on it
    const configuration$: Observable<string> = this.searchConfigService
      .getCurrentConfiguration(this.configuration).pipe(distinctUntilChanged());
    const searchSortOptions$: Observable<SortOptions[]> = configuration$.pipe(
      switchMap((configuration: string) => this.searchConfigService
        .getConfigurationSearchConfig(configuration, this.service)),
      map((searchConfig: SearchConfig) => this.searchConfigService.getConfigurationSortOptions(searchConfig)),
      distinctUntilChanged()
    );
    const sortOption$: Observable<SortOptions> = searchSortOptions$.pipe(
      switchMap((searchSortOptions: SortOptions[]) => {
        const defaultSort: SortOptions = searchSortOptions[0];
        return this.searchConfigService.getCurrentSort(this.paginationId, defaultSort);
      }),
      distinctUntilChanged()
    );
    const searchOptions$: Observable<PaginatedSearchOptions> = this.getSearchOptions().pipe(distinctUntilChanged());

    this.sub = combineLatest([configuration$, searchSortOptions$, searchOptions$, sortOption$]).pipe(
      filter(([configuration, searchSortOptions, searchOptions, sortOption]: [string, SortOptions[], PaginatedSearchOptions, SortOptions]) => {
        // filter for search options related to instanced paginated id
        return searchOptions.pagination.id === this.paginationId;
      })
    ).subscribe(([configuration, searchSortOptions, searchOptions, sortOption]: [string, SortOptions[], PaginatedSearchOptions, SortOptions]) => {
      // Build the PaginatedSearchOptions object
      const combinedOptions = Object.assign({}, searchOptions,
        {
          configuration: searchOptions.configuration || configuration,
          sort: sortOption || searchOptions.sort
        });
      const newSearchOptions = new PaginatedSearchOptions(combinedOptions);

      // Initialize variables
      this.currentConfiguration$.next(configuration);
      this.currentSortOptions$.next(newSearchOptions.sort);
      this.sortOptionsList$.next(searchSortOptions);
      this.searchOptions$.next(newSearchOptions);

      // retrieve results
      this.retrieveSearchResults(newSearchOptions);
    });
  }

  /**
   * Change the current context
   * @param context
   */
  public changeContext(context: Context) {
    this.currentContext$.next(context);
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
   * Unsubscribe from the subscription
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
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
   * Retrieve search result by the given search options
   * @param searchOptions
   * @private
   */
  private retrieveSearchResults(searchOptions: PaginatedSearchOptions) {
    this.resultsRD$.next(null);
    this.service.search(
      searchOptions,
      undefined,
      this.useCachedVersionIfAvailable,
      true,
      followLink<Item>('thumbnail', { isOptional: true })
    ).pipe(getFirstCompletedRemoteData())
      .subscribe((results: RemoteData<SearchObjects<DSpaceObject>>) => {
        console.log('results ', results);
        this.resultsRD$.next(results);
      });
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

}
