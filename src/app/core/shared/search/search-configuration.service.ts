import {
  Inject,
  Injectable,
  OnDestroy,
} from '@angular/core';
import {
  ActivatedRoute,
  Params,
} from '@angular/router';
import {
  BehaviorSubject,
  combineLatest as observableCombineLatest,
  merge as observableMerge,
  Observable,
  Subscription,
} from 'rxjs';
import {
  filter,
  map,
  startWith,
  take,
} from 'rxjs/operators';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../config/app-config.interface';
import {
  hasNoValue,
  hasValue,
  isNotEmpty,
  isNotEmptyOperator,
} from '../../../shared/empty.util';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { FacetConfigResponse } from '../../../shared/search/models/facet-config-response.model';
import { FilterType } from '../../../shared/search/models/filter-type.model';
import { PaginatedSearchOptions } from '../../../shared/search/models/paginated-search-options.model';
import { SearchFilter } from '../../../shared/search/models/search-filter.model';
import { SearchFilterConfig } from '../../../shared/search/models/search-filter-config.model';
import { SearchOptions } from '../../../shared/search/models/search-options.model';
import { addOperatorToFilterValue } from '../../../shared/search/search.utils';
import { LinkService } from '../../cache/builders/link.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import {
  SortDirection,
  SortOptions,
} from '../../cache/models/sort-options.model';
import { FacetConfigResponseParsingService } from '../../data/facet-config-response-parsing.service';
import { ResponseParsingService } from '../../data/parsing.service';
import { RemoteData } from '../../data/remote-data';
import { GetRequest } from '../../data/request.models';
import { RequestService } from '../../data/request.service';
import { PaginationService } from '../../pagination/pagination.service';
import { RouteService } from '../../services/route.service';
import { URLCombiner } from '../../url-combiner/url-combiner';
import { DSpaceObjectType } from '../dspace-object-type.model';
import { GenericConstructor } from '../generic-constructor';
import { HALEndpointService } from '../hal-endpoint.service';
import {
  getAllSucceededRemoteDataPayload,
  getFirstSucceededRemoteData,
} from '../operators';
import { ViewMode } from '../view-mode.model';
import {
  FilterConfig,
  SearchConfig,
  SortConfig,
} from './search-filters/search-config.model';

/**
 * Service that performs all actions that have to do with the current search configuration
 */
@Injectable({ providedIn: 'root' })
export class SearchConfigurationService implements OnDestroy {

  /**
   * Endpoint link path for retrieving search configurations
   */
  private configurationLinkPath = 'discover/search';

  /**
   * Endpoint link path for retrieving facet config incl values
   */
  private facetLinkPathPrefix = 'discover/facets/';

  /**
   * Default search instance id
   */
  public searchInstanceId = 'spc';

  /**
   * The names of the query parameters that are scoped to a search instance, but that still accept a
   * legacy (unprefixed) value for backwards compatibility. Filter parameters (prefixed with `f.`) are
   * handled separately, see {@link isLegacySearchParam}.
   */
  protected readonly legacyScopedQueryParams: string[] = ['configuration', 'scope', 'query', 'dsoType', 'view'];

  /**
   * Emits the current search options
   */
  public searchOptions: BehaviorSubject<SearchOptions>;

  /**
   * Emits the current search options including pagination and sort
   */
  public paginatedSearchOptions: BehaviorSubject<PaginatedSearchOptions>;

  /**
   * Default pagination settings
   */
  protected defaultPagination = Object.assign(new PaginationComponentOptions(), {
    id: this.searchInstanceId,
    pageSize: 10,
    currentPage: 1,
  });

  /**
   * Default scope setting
   */
  protected defaultScope = '';

  /**
   * Default query setting
   */
  protected defaultQuery = '';

  /**
   * Emits the current default values
   */
  protected _defaults: Observable<RemoteData<PaginatedSearchOptions>>;

  /**
   * A map of subscriptions to unsubscribe from on destroy
   */
  protected subs: Map<string, Subscription[]> = new Map<string, Subscription[]>(null);

  constructor(protected routeService: RouteService,
              protected paginationService: PaginationService,
              protected route: ActivatedRoute,
              protected linkService: LinkService,
              protected halService: HALEndpointService,
              protected requestService: RequestService,
              protected rdb: RemoteDataBuildService,
              @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    this.initDefaults();
  }

  /**
   * Default values for the Search Options
   */
  get defaults(): Observable<RemoteData<PaginatedSearchOptions>> {
    if (hasNoValue(this._defaults)) {
      const options = new PaginatedSearchOptions({
        pagination: this.defaultPagination,
        scope: this.defaultScope,
        query: this.defaultQuery,
      });
      this._defaults = createSuccessfulRemoteDataObject$(options, new Date().getTime());
    }
    return this._defaults;
  }

  /**
   * @returns {Observable<string>} Emits the current configuration string
   */
  getCurrentConfiguration(defaultConfiguration: string, searchInstanceId = this.searchInstanceId) {
    return observableCombineLatest([
      this.routeService.getQueryParameterValue(this.getSearchInstanceParam(searchInstanceId, 'configuration')).pipe(startWith(undefined)),
      this.routeService.getRouteParameterValue(this.getSearchInstanceParam(searchInstanceId, 'configuration')).pipe(startWith(undefined)),
      this.routeService.getQueryParameterValue('configuration').pipe(startWith(undefined)),
      this.routeService.getRouteParameterValue('configuration').pipe(startWith(undefined)),
    ]).pipe(
      map(([instanceQueryConfig, instanceRouteConfig, queryConfig, routeConfig]) => {
        return instanceQueryConfig || instanceRouteConfig || queryConfig || routeConfig || defaultConfiguration;
      }),
    );
  }

  /**
   * @returns {Observable<string>} Emits the current scope's identifier
   */
  getCurrentScope(defaultScope: string, searchInstanceId = this.searchInstanceId) {
    return this.getCurrentSearchInstanceQueryParam(searchInstanceId, 'scope').pipe(map((scope) => {
      return scope || defaultScope;
    }));
  }

  /**
   * @returns {Observable<string>} Emits the current query string
   */
  getCurrentQuery(defaultQuery: string, searchInstanceId = this.searchInstanceId) {
    return this.getCurrentSearchInstanceQueryParam(searchInstanceId, 'query').pipe(map((query) => {
      return hasValue(query) ? query : defaultQuery;
    }));
  }

  /**
   * @returns {Observable<number>} Emits the current DSpaceObject type as a number
   */
  getCurrentDSOType(searchInstanceId = this.searchInstanceId): Observable<DSpaceObjectType> {
    return this.getCurrentSearchInstanceQueryParam(searchInstanceId, 'dsoType').pipe(
      filter((type) => isNotEmpty(type) && hasValue(DSpaceObjectType[type.toUpperCase()])),
      map((type) => DSpaceObjectType[type.toUpperCase()]));
  }

  /**
   * @returns {Observable<string>} Emits the current pagination settings
   */
  getCurrentPagination(paginationId: string, defaultPagination: PaginationComponentOptions): Observable<PaginationComponentOptions> {
    return this.paginationService.getCurrentPagination(paginationId, defaultPagination);
  }

  /**
   * @returns {Observable<string>} Emits the current sorting settings
   */
  getCurrentSort(paginationId: string, defaultSort: SortOptions): Observable<SortOptions> {
    return this.paginationService.getCurrentSort(paginationId, defaultSort);
  }

  /**
   * @returns {Observable<Params>} Emits the current active filters with their values as they are sent to the backend
   */
  getCurrentFilters(searchInstanceId = this.searchInstanceId): Observable<SearchFilter[]> {
    return this.getCurrentFrontendFilters(searchInstanceId).pipe(map((filterParams) => {
      if (isNotEmpty(filterParams)) {
        const filters = [];
        const backendFilterParams = this.getBackendFilterParams(filterParams, searchInstanceId);
        Object.keys(backendFilterParams).forEach((key) => {
          if (key.endsWith('.min') || key.endsWith('.max')) {
            const realKey = key.slice(0, -4);
            if (hasNoValue(filters.find((f) => f.key === realKey))) {
              const min = backendFilterParams[realKey + '.min'] ? backendFilterParams[realKey + '.min'][0] : '*';
              const max = backendFilterParams[realKey + '.max'] ? backendFilterParams[realKey + '.max'][0] : '*';
              filters.push(new SearchFilter(realKey, ['[' + min + ' TO ' + max + ']'], 'equals'));
            }
          } else {
            filters.push(new SearchFilter(key, backendFilterParams[key]));
          }
        });
        return filters;
      }
      return [];
    }));
  }

  /**
   * @returns {Observable<string>} Emits the current fixed filter as a string
   */
  getCurrentFixedFilter(searchInstanceId = this.searchInstanceId): Observable<string> {
    return observableCombineLatest([
      this.routeService.getRouteParameterValue(this.getSearchInstanceParam(searchInstanceId, 'fixedFilterQuery')).pipe(startWith(undefined)),
      this.routeService.getRouteParameterValue('fixedFilterQuery').pipe(startWith(undefined)),
    ]).pipe(
      map(([instanceFixedFilter, fixedFilter]) => instanceFixedFilter || fixedFilter),
    );
  }

  /**
   * @returns {Observable<Params>} Emits the current active filters with their values as they are displayed in the frontend URL
   */
  getCurrentFrontendFilters(searchInstanceId = this.searchInstanceId): Observable<Params> {
    return observableCombineLatest([
      this.routeService.getQueryParamsWithPrefix(this.getSearchInstanceFilterParamPrefix(searchInstanceId)).pipe(startWith({})),
      this.routeService.getQueryParamsWithPrefix('f.').pipe(startWith({})),
    ]).pipe(map(([instanceFilters, legacyFilters]) => {
      return isNotEmpty(instanceFilters) ? instanceFilters : legacyFilters;
    }));
  }

  /**
   * @returns {Observable<string>} Emits the current view mode
   */
  getCurrentViewMode(defaultViewMode: ViewMode, searchInstanceId = this.searchInstanceId) {
    return this.getCurrentSearchInstanceQueryParam(searchInstanceId, 'view').pipe(map((viewMode) => {
      return viewMode || defaultViewMode;
    }));
  }

  /**
   * Creates an observable of SearchConfig every time the configuration stream emits.
   * @param configuration The search configuration
   * @param scope The search scope if exists
   */
  getConfigurationSearchConfig(configuration: string, scope?: string): Observable<SearchConfig> {
    return this.getSearchConfigurationFor(scope, configuration).pipe(
      getAllSucceededRemoteDataPayload(),
    );
  }

  /**
   * Return the SortOptions list available for the given SearchConfig
   * @param searchConfig The SearchConfig object
   */
  getConfigurationSortOptions(searchConfig: SearchConfig): SortOptions[] {
    return searchConfig.sortOptions.map((entry: SortConfig) => ({
      field: entry.name,
      direction: entry.sortOrder.toLowerCase() === SortDirection.ASC.toLowerCase() ? SortDirection.ASC : SortDirection.DESC,
    }));
  }

  /**
   * Return the {@link FilterConfig}s of the filters that should be displayed for the current configuration/scope
   *
   * @param configuration The search configuration
   * @param scope The scope if exists
   */
  public getConfigurationAdvancedSearchFilters(configuration: string, scope?: string): Observable<FilterConfig[]> {
    return this.getConfigurationSearchConfig(configuration, scope).pipe(
      map((searchConfiguration: SearchConfig) => {
        return searchConfiguration.filters
          .filter((filterConfig: FilterConfig) => this.appConfig.search.advancedFilters.filter.includes(filterConfig.filter))
          .filter((filterConfig: FilterConfig) => filterConfig.type !== FilterType.range);
      }),
    );
  }

  setSearchInstanceId(searchInstanceId): void {
    if (isNotEmpty(searchInstanceId)) {
      const currentValue: PaginatedSearchOptions = this.paginatedSearchOptions.getValue();
      const updatedValue: PaginatedSearchOptions = Object.assign(new PaginatedSearchOptions({}), currentValue, {
        pagination: Object.assign({}, currentValue.pagination, {
          id: searchInstanceId,
        }),
      });
      // unsubscribe from subscription related to old search instance id
      this.unsubscribeFromSearchOptions(this.searchInstanceId);

      // change to the new search instance id
      this.searchInstanceId = searchInstanceId;
      this.paginatedSearchOptions.next(updatedValue);
      this.setSearchSubscription(this.searchInstanceId, this.paginatedSearchOptions.value);
    }
  }

  getSearchInstanceParam(searchInstanceId: string, parameterName: string): string {
    return `${searchInstanceId}.${parameterName}`;
  }

  getCurrentSearchInstanceParam(parameterName: string): string {
    return this.getSearchInstanceParam(this.searchInstanceId, parameterName);
  }

  getSearchInstanceFilterParam(filterName: string, searchInstanceId = this.searchInstanceId): string {
    const filterParamName = filterName.startsWith('f.') ? filterName : `f.${filterName}`;
    return this.getSearchInstanceParam(searchInstanceId, filterParamName);
  }

  getCurrentSearchInstanceFilterParam(filterName: string): string {
    return this.getSearchInstanceFilterParam(filterName, this.searchInstanceId);
  }

  getSearchInstanceFilterParamPrefix(searchInstanceId = this.searchInstanceId): string {
    return this.getSearchInstanceParam(searchInstanceId, 'f.');
  }

  /**
   * Whether the given query parameter is a legacy (unprefixed) search parameter that has a
   * search-instance-prefixed equivalent (e.g. `query`, `scope` or a `f.xxx` filter). These
   * parameters are still read for backwards compatibility, but should be migrated to their
   * prefixed form so they don't get mixed with newly added prefixed parameters.
   *
   * @param paramName The query parameter name
   */
  isLegacySearchParam(paramName: string): boolean {
    return this.legacyScopedQueryParams.includes(paramName) || paramName.startsWith('f.');
  }

  getCurrentPageParam(): string {
    return this.paginationService.getPageParam(this.searchInstanceId);
  }

  private getCurrentSearchInstanceQueryParam(searchInstanceId: string, parameterName: string): Observable<string> {
    return observableCombineLatest([
      this.routeService.getQueryParameterValue(this.getSearchInstanceParam(searchInstanceId, parameterName)).pipe(startWith(undefined)),
      this.routeService.getQueryParameterValue(parameterName).pipe(startWith(undefined)),
    ]).pipe(
      map(([instanceValue, legacyValue]) => hasValue(instanceValue) ? instanceValue : legacyValue),
    );
  }

  private getBackendFilterParams(filterParams: Params, searchInstanceId: string): Params {
    const backendFilterParams = {};
    const instancePrefix = `${searchInstanceId}.`;
    Object.keys(filterParams).forEach((key) => {
      const backendKey = key.startsWith(instancePrefix) ? key.substring(instancePrefix.length) : key;
      backendFilterParams[backendKey] = filterParams[key];
    });
    return backendFilterParams;
  }

  /**
   * Make sure to unsubscribe from all existing subscription to prevent memory leaks
   */
  ngOnDestroy(): void {
    this.subs
      .forEach((subs: Subscription[]) => subs
        .filter((sub) => hasValue(sub))
        .forEach((sub) => sub.unsubscribe()),
      );

    this.subs = new Map<string, Subscription[]>(null);
  }

  /**
   * Initialize the search options
   */
  protected initDefaults() {
    this.defaults
      .pipe(getFirstSucceededRemoteData())
      .subscribe((defRD: RemoteData<PaginatedSearchOptions>) => {
        const defs = defRD.payload;
        this.paginatedSearchOptions = new BehaviorSubject<PaginatedSearchOptions>(defs);
        this.searchOptions = new BehaviorSubject<SearchOptions>(defs);
        this.setSearchSubscription(this.searchInstanceId, defs);
      });
  }

  private setSearchSubscription(searchInstanceId: string, defaults: PaginatedSearchOptions) {
    const instanceId = searchInstanceId || defaults.pagination.id;
    this.unsubscribeFromSearchOptions(instanceId);
    const subs = [
      this.subscribeToSearchOptions(instanceId, defaults),
      this.subscribeToPaginatedSearchOptions(instanceId, defaults),
    ];
    this.subs.set(instanceId, subs);
  }

  /**
   * Sets up a subscription to all necessary parameters to make sure the searchOptions emits a new value every time they update
   * @param {SearchOptions} defaults Default values for when no parameters are available
   * @returns {Subscription} The subscription to unsubscribe from
   */
  private subscribeToSearchOptions(searchInstanceId: string, defaults: SearchOptions): Subscription {
    return observableMerge(
      this.getConfigurationPart(searchInstanceId, defaults.configuration),
      this.getScopePart(searchInstanceId, defaults.scope),
      this.getQueryPart(searchInstanceId, defaults.query),
      this.getDSOTypePart(searchInstanceId),
      this.getFiltersPart(searchInstanceId),
      this.getFixedFilterPart(searchInstanceId),
      this.getViewModePart(searchInstanceId, defaults.view),
    ).subscribe((update) => {
      const currentValue: SearchOptions = this.searchOptions.getValue();
      const updatedValue: SearchOptions = Object.assign(new SearchOptions({}), currentValue, update);
      this.searchOptions.next(updatedValue);
    });
  }

  /**
   * Sets up a subscription to all necessary parameters to make sure the paginatedSearchOptions emits a new value every time they update
   * @param {string} searchInstanceId The search instance id
   * @param {PaginatedSearchOptions} defaults Default values for when no parameters are available
   * @returns {Subscription} The subscription to unsubscribe from
   */
  private subscribeToPaginatedSearchOptions(searchInstanceId: string, defaults: PaginatedSearchOptions): Subscription {
    return observableMerge(
      this.searchOptions.pipe(map((searchOptions: any) => {
        const update = Object.assign({}, searchOptions);
        delete update.pagination;
        delete update.sort;
        return update;
      })),
      this.getPaginationPart(searchInstanceId, defaults.pagination),
      this.getSortPart(searchInstanceId, defaults.sort),
    ).subscribe((update) => {
      const currentValue: PaginatedSearchOptions = this.paginatedSearchOptions.getValue();
      const updatedValue: PaginatedSearchOptions = Object.assign(new PaginatedSearchOptions({}), currentValue, update);
      this.paginatedSearchOptions.next(updatedValue);
    });
  }

  /**
   * Unsubscribe from all subscriptions related to the given search instance id
   * @param searchInstanceId The search instance id
   */
  private unsubscribeFromSearchOptions(searchInstanceId: string): void {
    if (this.subs.has(searchInstanceId)) {
      this.subs.get(searchInstanceId)
        .filter((sub) => hasValue(sub))
        .forEach((sub) => sub.unsubscribe());
      this.subs.delete(searchInstanceId);
    }
  }

  /**
   * @returns {Observable<string>} Emits the current configuration settings as a partial SearchOptions object
   */
  private getConfigurationPart(searchInstanceId: string, defaultConfiguration: string): Observable<any> {
    return this.getCurrentConfiguration(defaultConfiguration, searchInstanceId).pipe(map((configuration) => {
      return { configuration };
    }));
  }

  /**
   * @returns {Observable<string>} Emits the current scope's identifier
   */
  private getScopePart(searchInstanceId: string, defaultScope: string): Observable<any> {
    return this.getCurrentScope(defaultScope, searchInstanceId).pipe(map((scope) => {
      return { scope };
    }));
  }

  /**
   * @returns {Observable<string>} Emits the current query string as a partial SearchOptions object
   */
  private getQueryPart(searchInstanceId: string, defaultQuery: string): Observable<any> {
    return this.getCurrentQuery(defaultQuery, searchInstanceId).pipe(map((query) => {
      return { query };
    }));
  }

  /**
   * @returns {Observable<string>} Emits the current query string as a partial SearchOptions object
   */
  private getDSOTypePart(searchInstanceId: string): Observable<any> {
    return this.getCurrentDSOType(searchInstanceId).pipe(map((dsoType) => {
      return { dsoType };
    }));
  }

  /**
   * @returns {Observable<string>} Emits the current pagination settings as a partial SearchOptions object
   */
  private getPaginationPart(paginationId: string, defaultPagination: PaginationComponentOptions): Observable<any> {
    return this.getCurrentPagination(paginationId, defaultPagination).pipe(map((pagination) => {
      return { pagination };
    }));
  }

  /**
   * @returns {Observable<string>} Emits the current sorting settings as a partial SearchOptions object
   */
  private getSortPart(paginationId: string, defaultSort: SortOptions): Observable<any> {
    return this.getCurrentSort(paginationId, defaultSort).pipe(map((sort) => {
      return { sort };
    }));
  }

  /**
   * @returns {Observable<Params>} Emits the current active filters as a partial SearchOptions object
   */
  private getFiltersPart(searchInstanceId: string): Observable<any> {
    return this.getCurrentFilters(searchInstanceId).pipe(map((filters) => {
      return { filters };
    }));
  }

  /**
   * @returns {Observable<string>} Emits the current fixed filter as a partial SearchOptions object
   */
  private getFixedFilterPart(searchInstanceId: string): Observable<any> {
    return this.getCurrentFixedFilter(searchInstanceId).pipe(
      isNotEmptyOperator(),
      map((fixedFilter) => {
        return { fixedFilter };
      }),
    );
  }


  /**
   * Request the search configuration for a given scope or the whole repository
   * @param {string} scope UUID of the object for which config the filter config is requested, when no scope is provided the configuration for the whole repository is loaded
   * @param {string} configurationName the name of the configuration
   * @returns {Observable<RemoteData<SearchConfig[]>>} The found configuration
   */
  getSearchConfigurationFor(scope?: string, configurationName?: string): Observable<RemoteData<SearchConfig>> {
    const href$ = this.halService.getEndpoint(this.configurationLinkPath).pipe(
      map((url: string) => this.getConfigUrl(url, scope, configurationName)),
    );

    href$.pipe(take(1)).subscribe((url: string) => {
      const request = new GetRequest(this.requestService.generateRequestId(), url);
      this.requestService.send(request, true);
    });

    return this.rdb.buildFromHref(href$);
  }

  private getConfigUrl(url: string, scope?: string, configurationName?: string) {
    const args: string[] = [];

    if (isNotEmpty(scope)) {
      args.push(`scope=${scope}`);
    }

    if (isNotEmpty(configurationName)) {
      args.push(`configuration=${configurationName}`);
    }

    if (isNotEmpty(args)) {
      url = new URLCombiner(url, `?${args.join('&')}`).toString();
    }

    return url;
  }



  /**
   * Request the filter configuration for a given scope or the whole repository
   * @param {string} scope UUID of the object for which config the filter config is requested, when no scope is provided the configuration for the whole repository is loaded
   * @param {string} configurationName the name of the configuration
   * @returns {Observable<RemoteData<SearchFilterConfig[]>>} The found filter configuration
   */
  getConfig(scope?: string, configurationName?: string): Observable<RemoteData<SearchFilterConfig[]>> {
    const href$ = this.halService.getEndpoint(this.facetLinkPathPrefix).pipe(
      map((url: string) => this.getConfigUrl(url, scope, configurationName)),
    );

    href$.pipe(take(1)).subscribe((url: string) => {
      let request = new GetRequest(this.requestService.generateRequestId(), url);
      request = Object.assign(request, {
        getResponseParser(): GenericConstructor<ResponseParsingService> {
          return FacetConfigResponseParsingService;
        },
      });
      this.requestService.send(request, true);
    });

    return this.rdb.buildFromHref(href$).pipe(
      map((rd: RemoteData<FacetConfigResponse>) => {
        if (rd.hasSucceeded) {
          let filters: SearchFilterConfig[];
          if (isNotEmpty(rd.payload.filters)) {
            filters = rd.payload.filters
              .map((f: any) => Object.assign(new SearchFilterConfig(), f));
          } else {
            filters = [];
          }

          return new RemoteData(
            rd.timeCompleted,
            rd.msToLive,
            rd.lastUpdated,
            rd.state,
            rd.errorMessage,
            filters,
            rd.statusCode,
          );
        } else {
          return rd as any as RemoteData<SearchFilterConfig[]>;
        }
      }),
    );
  }

  /**
   * Calculates the {@link Params} of the search after removing a filter with a certain value and resets the page number.
   *
   * @param filterName The {@link AppliedFilter}'s name
   * @param value The {@link AppliedFilter}'s value
   * @param operator The {@link AppliedFilter}'s optional operator
   */
  unselectAppliedFilterParams(filterName: string, value: string, operator?: string): Observable<Params> {
    const filterParam: string = this.getCurrentSearchInstanceFilterParam(filterName);
    return this.routeService.getParamsExceptValue(filterParam, hasValue(operator) ? addOperatorToFilterValue(value, operator) : value).pipe(
      map((params: Params) => Object.assign(params, {
        [`f.${filterName}`]: null,
        [this.paginationService.getPageParam(this.searchInstanceId)]: 1,
      })),
    );
  }

  /**
   * Calculates the {@link Params} of the search after adding a filter with a certain value and resets the page number.
   *
   * @param filterName The {@link AppliedFilter}'s name
   * @param value The {@link AppliedFilter}'s value
   * @param operator The {@link AppliedFilter}'s optional operator
   */
  selectNewAppliedFilterParams(filterName: string, value: string, operator?: string): Observable<Params> {
    const filterParam: string = this.getCurrentSearchInstanceFilterParam(filterName);
    return this.routeService.getParamsWithAdditionalValue(filterParam, hasValue(operator) ? addOperatorToFilterValue(value, operator) : value).pipe(
      map((params: Params) => Object.assign(params, {
        [`f.${filterName}`]: null,
        [this.paginationService.getPageParam(this.searchInstanceId)]: 1,
      })),
    );
  }

  /**
   * @returns {Observable<Params>} Emits the current view mode as a partial SearchOptions object
   */
  private getViewModePart(searchInstanceId: string, defaultViewMode: ViewMode): Observable<any> {
    return this.getCurrentViewMode(defaultViewMode, searchInstanceId).pipe(map((view) => {
      return { view };
    }));
  }
}
