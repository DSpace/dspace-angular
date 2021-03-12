import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { BehaviorSubject, combineLatest as observableCombineLatest, merge as observableMerge, Observable, Subscription } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { SearchOptions } from '../../../shared/search/search-options.model';
import { PaginatedSearchOptions } from '../../../shared/search/paginated-search-options.model';
import { SearchFilter } from '../../../shared/search/search-filter.model';
import { RemoteData } from '../../data/remote-data';
import { DSpaceObjectType } from '../dspace-object-type.model';
import { SortDirection, SortOptions } from '../../cache/models/sort-options.model';
import { RouteService } from '../../services/route.service';
import { getFirstSucceededRemoteData } from '../operators';
import { hasNoValue, hasValue, isNotEmpty, isNotEmptyOperator } from '../../../shared/empty.util';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';

/**
 * Service that performs all actions that have to do with the current search configuration
 */
@Injectable()
export class SearchConfigurationService implements OnDestroy {
  /**
   * Default pagination settings
   */
  protected defaultPagination = Object.assign(new PaginationComponentOptions(), {
    id: 'search-page-configuration',
    pageSize: 10,
    currentPage: 1
  });

  /**
   * Default sort settings
   */
  protected defaultSort = new SortOptions('score', SortDirection.DESC);

  /**
   * Default configuration parameter setting
   */
  protected defaultConfiguration;

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
   * Emits the current search options
   */
  public searchOptions: BehaviorSubject<SearchOptions>;

  /**
   * Emits the current search options including pagination and sort
   */
  public paginatedSearchOptions: BehaviorSubject<PaginatedSearchOptions>;

  /**
   * List of subscriptions to unsubscribe from on destroy
   */
  protected subs: Subscription[] = [];

  /**
   * Initialize the search options
   * @param {RouteService} routeService
   * @param {ActivatedRoute} route
   */
  constructor(protected routeService: RouteService,
              protected route: ActivatedRoute) {

    this.initDefaults();
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
          this.subs.push(this.subscribeToSearchOptions(defs));
          this.subs.push(this.subscribeToPaginatedSearchOptions(defs));
        }
      );
  }

  /**
   * @returns {Observable<string>} Emits the current configuration string
   */
  getCurrentConfiguration(defaultConfiguration: string) {
    return observableCombineLatest(
      this.routeService.getQueryParameterValue('configuration').pipe(startWith(undefined)),
      this.routeService.getRouteParameterValue('configuration').pipe(startWith(undefined))
    ).pipe(
      map(([queryConfig, routeConfig]) => {
        return queryConfig || routeConfig || defaultConfiguration;
      })
    );
  }

  /**
   * @returns {Observable<string>} Emits the current scope's identifier
   */
  getCurrentScope(defaultScope: string) {
    return this.routeService.getQueryParameterValue('scope').pipe(map((scope) => {
      return scope || defaultScope;
    }));
  }

  /**
   * @returns {Observable<string>} Emits the current query string
   */
  getCurrentQuery(defaultQuery: string) {
    return this.routeService.getQueryParameterValue('query').pipe(map((query) => {
      return query || defaultQuery;
    }));
  }

  /**
   * @returns {Observable<number>} Emits the current DSpaceObject type as a number
   */
  getCurrentDSOType(): Observable<DSpaceObjectType> {
    return this.routeService.getQueryParameterValue('dsoType').pipe(
      filter((type) => isNotEmpty(type) && hasValue(DSpaceObjectType[type.toUpperCase()])),
      map((type) => DSpaceObjectType[type.toUpperCase()]),);
  }

  /**
   * @returns {Observable<string>} Emits the current pagination settings
   */
  getCurrentPagination(defaultPagination: PaginationComponentOptions): Observable<PaginationComponentOptions> {
    const page$ = this.routeService.getQueryParameterValue('page');
    const size$ = this.routeService.getQueryParameterValue('pageSize');
    return observableCombineLatest(page$, size$).pipe(map(([page, size]) => {
        return Object.assign(new PaginationComponentOptions(), defaultPagination, {
          currentPage: page || defaultPagination.currentPage,
          pageSize: size || defaultPagination.pageSize
        });
      })
    );
  }

  /**
   * @returns {Observable<string>} Emits the current sorting settings
   */
  getCurrentSort(defaultSort: SortOptions): Observable<SortOptions> {
    const sortDirection$ = this.routeService.getQueryParameterValue('sortDirection');
    const sortField$ = this.routeService.getQueryParameterValue('sortField');
    return observableCombineLatest(sortDirection$, sortField$).pipe(map(([sortDirection, sortField]) => {
        // Dirty fix because sometimes the observable value is null somehow
        sortField = this.route.snapshot.queryParamMap.get('sortField');

        const field = sortField || defaultSort.field;
        const direction = SortDirection[sortDirection] || defaultSort.direction;
        return new SortOptions(field, direction);
      }
      )
    );
  }

  /**
   * @returns {Observable<Params>} Emits the current active filters with their values as they are sent to the backend
   */
  getCurrentFilters(): Observable<SearchFilter[]> {
    return this.routeService.getQueryParamsWithPrefix('f.').pipe(map((filterParams) => {
      if (isNotEmpty(filterParams)) {
        const filters = [];
        Object.keys(filterParams).forEach((key) => {
          if (key.endsWith('.min') || key.endsWith('.max')) {
            const realKey = key.slice(0, -4);
            if (hasNoValue(filters.find((f) => f.key === realKey))) {
              const min = filterParams[realKey + '.min'] ? filterParams[realKey + '.min'][0] : '*';
              const max = filterParams[realKey + '.max'] ? filterParams[realKey + '.max'][0] : '*';
              filters.push(new SearchFilter(realKey, ['[' + min + ' TO ' + max + ']']));
            }
          } else {
            filters.push(new SearchFilter(key, filterParams[key]));
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
  getCurrentFixedFilter(): Observable<string> {
    return this.routeService.getRouteParameterValue('fixedFilterQuery');
  }

  /**
   * @returns {Observable<Params>} Emits the current active filters with their values as they are displayed in the frontend URL
   */
  getCurrentFrontendFilters(): Observable<Params> {
    return this.routeService.getQueryParamsWithPrefix('f.');
  }

  /**
   * Sets up a subscription to all necessary parameters to make sure the searchOptions emits a new value every time they update
   * @param {SearchOptions} defaults Default values for when no parameters are available
   * @returns {Subscription} The subscription to unsubscribe from
   */
  private subscribeToSearchOptions(defaults: SearchOptions): Subscription {
    return observableMerge(
      this.getConfigurationPart(defaults.configuration),
      this.getScopePart(defaults.scope),
      this.getQueryPart(defaults.query),
      this.getDSOTypePart(),
      this.getFiltersPart(),
      this.getFixedFilterPart()
    ).subscribe((update) => {
      const currentValue: SearchOptions = this.searchOptions.getValue();
      const updatedValue: SearchOptions = Object.assign(new PaginatedSearchOptions({}), currentValue, update);
      this.searchOptions.next(updatedValue);
    });
  }

  /**
   * Sets up a subscription to all necessary parameters to make sure the paginatedSearchOptions emits a new value every time they update
   * @param {PaginatedSearchOptions} defaults Default values for when no parameters are available
   * @returns {Subscription} The subscription to unsubscribe from
   */
  private subscribeToPaginatedSearchOptions(defaults: PaginatedSearchOptions): Subscription {
    return observableMerge(
      this.getPaginationPart(defaults.pagination),
      this.getSortPart(defaults.sort),
      this.getConfigurationPart(defaults.configuration),
      this.getScopePart(defaults.scope),
      this.getQueryPart(defaults.query),
      this.getDSOTypePart(),
      this.getFiltersPart(),
      this.getFixedFilterPart()
    ).subscribe((update) => {
      const currentValue: PaginatedSearchOptions = this.paginatedSearchOptions.getValue();
      const updatedValue: PaginatedSearchOptions = Object.assign(new PaginatedSearchOptions({}), currentValue, update);
      this.paginatedSearchOptions.next(updatedValue);
    });
  }

  /**
   * Default values for the Search Options
   */
  get defaults(): Observable<RemoteData<PaginatedSearchOptions>> {
    if (hasNoValue(this._defaults)) {
      const options = new PaginatedSearchOptions({
        pagination: this.defaultPagination,
        configuration: this.defaultConfiguration,
        sort: this.defaultSort,
        scope: this.defaultScope,
        query: this.defaultQuery
      });
      this._defaults = createSuccessfulRemoteDataObject$(options, new Date().getTime());
    }
    return this._defaults;
  }

  /**
   * Make sure to unsubscribe from all existing subscription to prevent memory leaks
   */
  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
    this.subs = [];
  }

  /**
   * @returns {Observable<string>} Emits the current configuration settings as a partial SearchOptions object
   */
  private getConfigurationPart(defaultConfiguration: string): Observable<any> {
    return this.getCurrentConfiguration(defaultConfiguration).pipe(map((configuration) => {
      return { configuration };
    }));
  }

  /**
   * @returns {Observable<string>} Emits the current scope's identifier
   */
  private getScopePart(defaultScope: string): Observable<any> {
    return this.getCurrentScope(defaultScope).pipe(map((scope) => {
      return { scope };
    }));
  }

  /**
   * @returns {Observable<string>} Emits the current query string as a partial SearchOptions object
   */
  private getQueryPart(defaultQuery: string): Observable<any> {
    return this.getCurrentQuery(defaultQuery).pipe(map((query) => {
      return { query };
    }));
  }

  /**
   * @returns {Observable<string>} Emits the current query string as a partial SearchOptions object
   */
  private getDSOTypePart(): Observable<any> {
    return this.getCurrentDSOType().pipe(map((dsoType) => {
      return { dsoType };
    }));
  }

  /**
   * @returns {Observable<string>} Emits the current pagination settings as a partial SearchOptions object
   */
  private getPaginationPart(defaultPagination: PaginationComponentOptions): Observable<any> {
    return this.getCurrentPagination(defaultPagination).pipe(map((pagination) => {
      return { pagination };
    }));
  }

  /**
   * @returns {Observable<string>} Emits the current sorting settings as a partial SearchOptions object
   */
  private getSortPart(defaultSort: SortOptions): Observable<any> {
    return this.getCurrentSort(defaultSort).pipe(map((sort) => {
      return { sort };
    }));
  }

  /**
   * @returns {Observable<Params>} Emits the current active filters as a partial SearchOptions object
   */
  private getFiltersPart(): Observable<any> {
    return this.getCurrentFilters().pipe(map((filters) => {
      return { filters };
    }));
  }

  /**
   * @returns {Observable<string>} Emits the current fixed filter as a partial SearchOptions object
   */
  private getFixedFilterPart(): Observable<any> {
    return this.getCurrentFixedFilter().pipe(
      isNotEmptyOperator(),
      map((fixedFilter) => {
        return { fixedFilter };
      }),
    );
  }
}
