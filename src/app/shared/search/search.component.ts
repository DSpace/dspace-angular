import {
  AsyncPipe,
  isPlatformServer,
  NgTemplateOutlet,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import {
  NavigationStart,
  Router,
} from '@angular/router';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { SortOptions } from '@dspace/core/cache/models/sort-options.model';
import { PaginatedList } from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import {
  COLLECTION_MODULE_PATH,
  COMMUNITY_MODULE_PATH,
  ITEM_MODULE_PATH,
} from '@dspace/core/router/core-routing-paths';
import { currentPath } from '@dspace/core/router/utils/route.utils';
import { RouteService } from '@dspace/core/services/route.service';
import { Context } from '@dspace/core/shared/context.model';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { Item } from '@dspace/core/shared/item.model';
import { ListableObject } from '@dspace/core/shared/object-collection/listable-object.model';
import {
  getAllCompletedRemoteData,
  getAllSucceededRemoteDataPayload,
  getFirstCompletedRemoteData,
} from '@dspace/core/shared/operators';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { SearchFilterConfig } from '@dspace/core/shared/search/models/search-filter-config.model';
import { SearchObjects } from '@dspace/core/shared/search/models/search-objects.model';
import { SearchResult } from '@dspace/core/shared/search/models/search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { SubmissionObject } from '@dspace/core/submission/models/submission-object.model';
import { WorkspaceItem } from '@dspace/core/submission/models/workspaceitem.model';
import {
  hasValue,
  hasValueOperator,
  isEmpty,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';
import uniqueId from 'lodash/uniqueId';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subscription,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
} from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { DiscoveryConfiguration } from '../../core/shared/search/discovery-configuration.model';
import { Facet } from '../../core/shared/search/facet.model';
import { SearchSortOption } from '../../core/shared/search/search-sort-option.model';
import { SEARCH_CONFIG_SERVICE } from '../../my-dspace-page/my-dspace-configuration.service';
import { pushInOut } from '../animations/push';
import { HostWindowService } from '../host-window.service';
import { CollectionElementLinkType } from '../object-collection/collection-element-link.type';
import { ThemedSearchFormComponent } from '../search-form/themed-search-form.component';
import { PageWithSidebarComponent } from '../sidebar/page-with-sidebar.component';
import { SidebarService } from '../sidebar/sidebar.service';
import { ViewModeSwitchComponent } from '../view-mode-switch/view-mode-switch.component';
import { SearchService } from './search.service';
import { SearchConfigurationService } from './search-configuration.service';
import { SearchLabelsComponent } from './search-labels/search-labels.component';
import { SelectionConfig } from './search-results/search-results.component';
import { ThemedSearchResultsComponent } from './search-results/themed-search-results.component';
import { ThemedSearchSidebarComponent } from './search-sidebar/themed-search-sidebar.component';
import { SearchConfigurationOption } from './search-switch-configuration/search-configuration-option.model';
import { DiscoveryConfigurationDataService } from './services/discovery-configuration.data.service';
import { SearchFacetDataService } from './services/search-facet.data.service';
import { SearchResultsDataService } from './services/search-results.data.service';

@Component({
  selector: 'ds-base-search',
  styleUrls: ['./search.component.scss'],
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [pushInOut],
  imports: [
    AsyncPipe,
    NgTemplateOutlet,
    PageWithSidebarComponent,
    SearchLabelsComponent,
    ThemedSearchFormComponent,
    ThemedSearchResultsComponent,
    ThemedSearchSidebarComponent,
    TranslateModule,
    ViewModeSwitchComponent,
  ],
})

/**
 * This component renders a sidebar, a search input bar and the search results.
 */
export class SearchComponent implements OnDestroy, OnInit {

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
  @Input() configuration;

  /**
   * The actual query for the fixed filter.
   * If empty, the query will be determined by the route parameter called 'filter'
   */
  @Input() fixedFilterQuery: string;

  /**
   * A hidden query that will be used but not displayed in the url/searchbar
   */
  @Input() hiddenQuery: string;

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
   * The link type of the listed search results
   */
  @Input() linkType: CollectionElementLinkType;

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
   * The placeholder of the search form input
   */
  @Input() searchFormPlaceholder = 'search.search-form.placeholder';

  /**
   * A boolean representing if result entries are selectable
   */
  @Input() selectable = false;

  /**
   * The config option used for selection functionality
   */
  @Input() selectionConfig: SelectionConfig;

  /**
   * A boolean representing if show csv export button
   */
  @Input() showCsvExport = false;

  /**
   * A boolean representing if show search sidebar button
   */
  @Input() showSidebar = true;

  /**
   * Whether to show the thumbnail preview
   */
  @Input() showThumbnails;

  /**
   * Whether to show the view mode switch
   */
  @Input() showViewModes = true;

  /**
   * List of available view mode
   */
  @Input() useUniquePageId: boolean;

  /**
   * List of available view mode
   */
  @Input() viewModeList: ViewMode[];

  /**
   * Defines whether or not to show the scope selector
   */
  @Input() showScopeSelector = true;

  /**
   * Whether or not to track search statistics by sending updates to the rest api
   */
  @Input() trackStatistics = false;

  /**
   * The default value for the search query when none is already defined in the {@link SearchConfigurationService}
   */
  @Input() query: string;

  /**
   * The fallback scope when no scope is defined in the url, if this is also undefined no scope will be set
   */
  @Input() scope: string;

  /**
   * Hides the scope in the url, this can be useful when you hardcode the scope in another way
   */
  @Input() hideScopeInUrl: boolean;

  /**
   * Defines whether to fetch search results during SSR execution
   */
  @Input() renderOnServerSide: boolean;

  /**
   * The current configuration used during the search
   */
  currentConfiguration$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * The current context used during the search
   */
  currentContext$: BehaviorSubject<Context> = new BehaviorSubject<Context>(null);

  /**
   * The current sort options used
   */
  currentScope$: Observable<string>;


  /**
   * The current sort options used
   */
  currentSortOptions$: BehaviorSubject<SortOptions> = new BehaviorSubject<SortOptions>(null);

  /**
   * An observable containing configuration about which filters are available
   */
  filtersRD$: BehaviorSubject<RemoteData<PaginatedList<SearchFilterConfig>>> = new BehaviorSubject<RemoteData<PaginatedList<SearchFilterConfig>>>(null);

  /**
   * An observable containing configuration about which facets are shown and how they are shown
   */
  facetsRD$: BehaviorSubject<RemoteData<PaginatedList<Facet>>> = new BehaviorSubject<RemoteData<PaginatedList<Facet>>>(null);

  /**
   * An observable containing configuration of filters that are supported by the current available facets
   */
  facetFilters$: BehaviorSubject<SearchFilterConfig[]> = new BehaviorSubject<SearchFilterConfig[]>([]);

  /**
   * Maintains the last search options, so it can be used in refresh
   */
  lastSearchOptions: PaginatedSearchOptions;

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
   * TRUE if the search option are initialized
   */
  initialized$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Observable for whether or not the sidebar is currently collapsed
   */
  isSidebarCollapsed$: Observable<boolean>;

  /**
   * Emits true if were on a small screen
   */
  isXsOrSm$: Observable<boolean>;

  /**
   * Emits when the search filters values may be stale, and so they must be refreshed.
   */
  refreshFilters: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Link to the search page
   */
  searchLink: string;

  /**
   * Regex to match UUIDs
   */
  uuidRegex = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/g;

  /**
   * List of paths that are considered to be the start of a route to an object page (excluding "/", e.g. "items")
   * These are expected to end on an object UUID
   * If they match the route we're navigating to, an object property will be added to the search event sent
   */
  allowedObjectPaths: string[] = ['entities', ITEM_MODULE_PATH, COLLECTION_MODULE_PATH, COMMUNITY_MODULE_PATH];

  /**
   * Subscriptions to unsubscribe from
   */
  subs: Subscription[] = [];

  /**
   * Emits an event with the current search result entries
   */
  @Output() resultFound: EventEmitter<SearchObjects<DSpaceObject>> = new EventEmitter<SearchObjects<DSpaceObject>>();

  /**
   * Emits event when the user deselect result entry
   */
  @Output() deselectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();

  /**
   * Emits event when the user select result entry
   */
  @Output() selectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();

  constructor(protected service: SearchService,
              protected searchResultsService: SearchResultsDataService,
              protected facetService: SearchFacetDataService,
              protected discoveryConfigurationService: DiscoveryConfigurationDataService,
              protected sidebarService: SidebarService,
              protected windowService: HostWindowService,
              @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
              protected routeService: RouteService,
              protected router: Router,
              @Inject(APP_CONFIG) protected appConfig: AppConfig,
              @Inject(PLATFORM_ID) public platformId: string,
              protected paginationService: PaginationService,
  ) {
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
    if (!this.renderOnServerSide && !environment.ssr.enableSearchComponent && isPlatformServer(this.platformId)) {
      this.subs.push(this.getSearchOptions().pipe(distinctUntilChanged()).subscribe((options) => {
        this.searchOptions$.next(options);
      }));
      this.initialized$.next(true);
      return;
    }

    if (this.useUniquePageId) {
      // Create an unique pagination id related to the instance of the SearchComponent
      this.paginationId = uniqueId(this.paginationId);
    }

    this.searchConfigService.setPaginationId(this.paginationId);

    if (hasValue(this.configuration)) {
      this.routeService.setParameter('configuration', this.configuration);
    }
    if (hasValue(this.fixedFilterQuery)) {
      this.routeService.setParameter('fixedFilterQuery', this.fixedFilterQuery);
    }

    this.currentScope$ = this.routeService.getQueryParameterValue('scope').pipe(
      map((routeValue: string) => hasValue(routeValue) ? routeValue : this.scope ?? ''),
    );

    this.isSidebarCollapsed$ = this.isSidebarCollapsed();
    this.searchLink = this.getSearchLink();
    this.currentContext$.next(this.context);

    // Determinate PaginatedSearchOptions and listen to any update on it
    const configuration$: Observable<string> = this.searchConfigService
      .getCurrentConfiguration(this.configuration).pipe(distinctUntilChanged());
    const discoveryConfiguration$: Observable<DiscoveryConfiguration> = combineLatest([configuration$, this.currentScope$]).pipe(
      switchMap(([configuration, scope]: [string, string]) =>
        this.discoveryConfigurationService.findByIdOrScope(configuration, scope, undefined, undefined,
          followLink('sortoptions'), followLink('defaultsortoption'), followLink('searchfilters'))),
      getAllSucceededRemoteDataPayload(),
    );
    const defaultSortOption$: Observable<SortOptions> = discoveryConfiguration$.pipe(
      switchMap((discoveryConfiguration: DiscoveryConfiguration) => discoveryConfiguration.defaultsortoption),
      getAllSucceededRemoteDataPayload(),
      map((searchSortOption: SearchSortOption) => searchSortOption.option),
    );
    const searchSortOptions$: Observable<SortOptions[]> = discoveryConfiguration$.pipe(
      switchMap((discoveryConfiguration: DiscoveryConfiguration) => discoveryConfiguration.sortoptions),
      getAllSucceededRemoteDataPayload(),
      map((sortOptions: PaginatedList<SearchSortOption>) => sortOptions.page.map((searchSortOption: SearchSortOption) => searchSortOption.option)),
      distinctUntilChanged(),
    );
    const sortOption$: Observable<SortOptions> = defaultSortOption$.pipe(
      switchMap((defaultSort: SortOptions) => this.searchConfigService.getCurrentSort(this.paginationId, defaultSort)),
      distinctUntilChanged(),
    );
    const searchOptions$: Observable<PaginatedSearchOptions> = this.getSearchOptions().pipe(distinctUntilChanged());
    const searchFilters$: Observable<RemoteData<PaginatedList<SearchFilterConfig>>> = discoveryConfiguration$.pipe(
      switchMap((discoveryConfiguration: DiscoveryConfiguration) => discoveryConfiguration.searchfilters),
      getAllCompletedRemoteData(),
    );
    const facets$: Observable<RemoteData<PaginatedList<Facet>>> = combineLatest([configuration$, this.currentScope$]).pipe(
      switchMap(([configuration, scope]: [string, string]) => this.facetService.findAll(new PaginatedSearchOptions({ configuration, scope }))),
      getAllCompletedRemoteData(),
    );
    const facetFilters$: Observable<SearchFilterConfig[]> = combineLatest([
      searchFilters$,
      facets$,
    ]).pipe(
      map(([filters, facets]: [RemoteData<PaginatedList<SearchFilterConfig>>, RemoteData<PaginatedList<Facet>>]) => {
        if (filters.hasSucceeded) {
          if (facets.hasSucceeded) {
            return filters.payload.page.filter((searchFilter) => facets.payload.page.some((facet) => facet.name === searchFilter.name));
          } else {
            return filters.payload.page;
          }
        } else {
          return [];
        }
      }),
    );

    this.subs.push(combineLatest([configuration$, searchSortOptions$, searchOptions$, sortOption$, searchFilters$, facets$, facetFilters$, this.currentScope$]).pipe(
      filter(([configuration, searchSortOptions, searchOptions, sortOption, searchFilters, facets, facetFilters, scope]: [string, SortOptions[], PaginatedSearchOptions, SortOptions, RemoteData<PaginatedList<SearchFilterConfig>>, RemoteData<PaginatedList<Facet>>, SearchFilterConfig[], string]) => {
        // filter for search options related to instanced paginated id
        return searchOptions.pagination.id === this.paginationId;
      }),
      debounceTime(100),
    ).subscribe(([configuration, searchSortOptions, searchOptions, sortOption, searchFilters, facets, facetFilters, scope]: [string, SortOptions[], PaginatedSearchOptions, SortOptions, RemoteData<PaginatedList<SearchFilterConfig>>, RemoteData<PaginatedList<Facet>>, SearchFilterConfig[], string]) => {
      // Build the PaginatedSearchOptions object
      const combinedOptions = Object.assign({}, searchOptions,
        {
          configuration: searchOptions.configuration || configuration,
          sort: sortOption || searchOptions.sort,
        });
      if (combinedOptions.query === '') {
        combinedOptions.query = this.query;
      }
      if (isEmpty(combinedOptions.scope)) {
        combinedOptions.scope = scope;
      }
      const newSearchOptions = new PaginatedSearchOptions(combinedOptions);
      // check if search options are changed
      // if so retrieve new related results otherwise skip it
      if (JSON.stringify(newSearchOptions) !== JSON.stringify(this.searchOptions$.value)) {
        // Initialize variables
        this.currentConfiguration$.next(configuration);
        this.currentSortOptions$.next(newSearchOptions.sort);
        this.sortOptionsList$.next(searchSortOptions);
        this.searchOptions$.next(newSearchOptions);
        this.initialized$.next(true);
        // retrieve results
        this.retrieveSearchResults(newSearchOptions);
        this.filtersRD$.next(searchFilters);
        this.facetsRD$.next(facets);
        this.facetFilters$.next(facetFilters);
      }
    }));

    this.subscribeToRoutingEvents();
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
   * Reset result list on view mode change
   */
  public changeViewMode() {
    this.resultsRD$.next(null);
  }

  /**
   * Set the sidebar to an expanded state
   */
  public openSidebar(): void {
    this.sidebarService.expand();
  }

  /**
   * Unsubscribe from the subscriptions
   */
  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
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
    this.lastSearchOptions = searchOptions;
    const followLinks = [
      followLink<Item>('thumbnail', { isOptional: true }),
      followLink<SubmissionObject>('item', { isOptional: true }, followLink<Item>('thumbnail', { isOptional: true })) as any,
    ];
    if (this.appConfig.item.showAccessStatuses) {
      followLinks.push(followLink<Item>('accessStatus', { isOptional: true }));
    }
    if (this.configuration === 'supervision') {
      followLinks.push(followLink<WorkspaceItem>('supervisionOrders', { isOptional: true }) as any);
    }

    const searchOptionsWithHidden = Object.assign (new PaginatedSearchOptions({}), searchOptions);
    if (isNotEmpty(this.hiddenQuery)) {
      if (isNotEmpty(searchOptionsWithHidden.query)) {
        searchOptionsWithHidden.query = searchOptionsWithHidden.query + ' AND ' + this.hiddenQuery;
      } else {
        searchOptionsWithHidden.query = this.hiddenQuery;
      }
    }

    this.searchResultsService.searchObjects(
      searchOptionsWithHidden,
      undefined,
      this.useCachedVersionIfAvailable,
      true,
      ...followLinks,
    ).pipe(getFirstCompletedRemoteData())
      .subscribe((results: RemoteData<SearchObjects<DSpaceObject>>) => {
        // Fallback logic: if no results and requested page > 1, navigate to the last available page
        if (results.hasSucceeded && results.payload?.page?.length === 0 && searchOptionsWithHidden.pagination.currentPage > 1) {
          const totalPages = results.payload?.pageInfo?.totalPages;
          if (totalPages && totalPages > 0 && searchOptionsWithHidden.pagination.currentPage > totalPages) {
            // Update the route to the last available page
            this.paginationService.updateRoute(this.paginationId, { page: totalPages });
            return;
          }
        }
        if (results.hasSucceeded) {
          if (this.trackStatistics) {
            this.service.trackSearch(searchOptionsWithHidden, results.payload);
          }
          if (results.payload?.page?.length > 0) {
            this.resultFound.emit(results.payload);
          }
        }
        this.resultsRD$.next(results);
      });
  }

  /**
   * Subscribe to routing events to detect when a user moves away from the search page
   * When the user is routing to an object page, it needs to send out a separate search event containing that object's UUID
   * This method should only be called once and is essentially what SearchTrackingComponent used to do (now removed)
   * @private
   */
  private subscribeToRoutingEvents(): void {
    if (this.trackStatistics) {
      this.subs.push(
        this.router.events.pipe(
          filter((event) => event instanceof NavigationStart),
          map((event: NavigationStart) => this.getDsoUUIDFromUrl(event.url)),
          hasValueOperator(),
        ).subscribe((uuid) => {
          if (this.resultsRD$.value.hasSucceeded) {
            this.service.trackSearch(this.searchOptions$.value, this.resultsRD$.value.payload as SearchObjects<DSpaceObject>, uuid);
          }
        }),
      );
    }
  }

  /**
   * Get the UUID from a DSO url
   * Return null if the url isn't an object page (allowedObjectPaths) or the UUID couldn't be found
   * @param url
   */
  private getDsoUUIDFromUrl(url: string): string {
    if (isNotEmpty(url)) {
      if (this.allowedObjectPaths.some((path) => url.startsWith(`/${path}`))) {
        const uuid = url.substring(url.lastIndexOf('/') + 1);
        if (uuid.match(this.uuidRegex)) {
          return uuid;
        }
      }
    }
    return null;
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
