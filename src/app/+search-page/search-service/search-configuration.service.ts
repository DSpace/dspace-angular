import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SearchOptions } from '../search-options.model';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params } from '@angular/router';
import { PaginatedSearchOptions } from '../paginated-search-options.model';
import { Injectable, OnDestroy } from '@angular/core';
import { RouteService } from '../../shared/services/route.service';
import { hasNoValue, hasValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { RemoteData } from '../../core/data/remote-data';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { getSucceededRemoteData } from '../../core/shared/operators';
import { SearchFilter } from '../search-filter.model';
import { DSpaceObjectType } from '../../core/shared/dspace-object-type.model';
import { SearchFixedFilterService } from '../search-filters/search-filter/search-fixed-filter.service';

/**
 * Service that performs all actions that have to do with the current search configuration
 */
@Injectable()
export class SearchConfigurationService implements OnDestroy {
  /**
   * Default pagination settings
   */
  private defaultPagination = Object.assign(new PaginationComponentOptions(), {
    id: 'search-page-configuration',
    pageSize: 10,
    currentPage: 1
  });

  /**
   * Default sort settings
   */
  private defaultSort = new SortOptions('score', SortDirection.DESC);

  /**
   * Default scope setting
   */
  private defaultScope = '';

  /**
   * Default query setting
   */
  private defaultQuery = '';

  /**
   * Emits the current default values
   */
  private _defaults: Observable<RemoteData<PaginatedSearchOptions>>;

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
  private subs: Subscription[] = new Array();

  /**
   * Initialize the search options
   * @param {RouteService} routeService
   * @param {ActivatedRoute} route
   */
  constructor(private routeService: RouteService,
              private fixedFilterService: SearchFixedFilterService,
              private route: ActivatedRoute) {
    this.defaults
      .pipe(getSucceededRemoteData())
      .subscribe((defRD) => {
          const defs = defRD.payload;
          this.paginatedSearchOptions = new BehaviorSubject<SearchOptions>(defs);
          this.searchOptions = new BehaviorSubject<PaginatedSearchOptions>(defs);

          this.subs.push(this.subscribeToSearchOptions(defs));
          this.subs.push(this.subscribeToPaginatedSearchOptions(defs));
        }
      )
  }

  /**
   * @returns {Observable<string>} Emits the current scope's identifier
   */
  getCurrentScope(defaultScope: string) {
    return this.routeService.getQueryParameterValue('scope').map((scope) => {
      return scope || defaultScope;
    });
  }

  /**
   * @returns {Observable<string>} Emits the current query string
   */
  getCurrentQuery(defaultQuery: string) {
    return this.routeService.getQueryParameterValue('query').map((query) => {
      return query || defaultQuery;
    });
  }

  /**
   * @returns {Observable<number>} Emits the current DSpaceObject type as a number
   */
  getCurrentDSOType(): Observable<DSpaceObjectType> {
    return this.routeService.getQueryParameterValue('dsoType')
      .filter((type) => hasValue(type) && hasValue(DSpaceObjectType[type.toUpperCase()]))
      .map((type) => DSpaceObjectType[type.toUpperCase()]);
  }

  /**
   * @returns {Observable<string>} Emits the current pagination settings
   */
  getCurrentPagination(defaultPagination: PaginationComponentOptions): Observable<PaginationComponentOptions> {
    const page$ = this.routeService.getQueryParameterValue('page');
    const size$ = this.routeService.getQueryParameterValue('pageSize');
    return Observable.combineLatest(page$, size$, (page, size) => {
      return Object.assign(new PaginationComponentOptions(), defaultPagination, {
        currentPage: page || defaultPagination.currentPage,
        pageSize: size || defaultPagination.pageSize
      });
    });
  }

  /**
   * @returns {Observable<string>} Emits the current sorting settings
   */
  getCurrentSort(defaultSort: SortOptions): Observable<SortOptions> {
    const sortDirection$ = this.routeService.getQueryParameterValue('sortDirection');
    const sortField$ = this.routeService.getQueryParameterValue('sortField');
    return Observable.combineLatest(sortDirection$, sortField$, (sortDirection, sortField) => {
        // Dirty fix because sometimes the observable value is null somehow
        sortField = this.route.snapshot.queryParamMap.get('sortField');

        const field = sortField || defaultSort.field;
        const direction = SortDirection[sortDirection] || defaultSort.direction;
        return new SortOptions(field, direction)
      }
    )
  }

  /**
   * @returns {Observable<Params>} Emits the current active filters with their values as they are sent to the backend
   */
  getCurrentFilters(): Observable<SearchFilter[]> {
    return this.routeService.getQueryParamsWithPrefix('f.').map((filterParams) => {
      if (isNotEmpty(filterParams)) {
        const filters = [];
        Object.keys(filterParams).forEach((key) => {
          if (key.endsWith('.min') || key.endsWith('.max')) {
            const realKey = key.slice(0, -4);
            if (hasNoValue(filters.find((filter) => filter.key === realKey))) {
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
    });
  }

  /**
   * @returns {Observable<string>} Emits the current fixed filter as a string
   */
  getCurrentFixedFilter(): Observable<string> {
    const fixedFilter: Observable<string> = this.routeService.getRouteParameterValue('filter');
    return fixedFilter.flatMap((f) => this.fixedFilterService.getQueryByFilterName(f));
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
  subscribeToSearchOptions(defaults: SearchOptions): Subscription {
    return Observable.merge(
      this.getScopePart(defaults.scope),
      this.getQueryPart(defaults.query),
      this.getDSOTypePart(),
      this.getFiltersPart(),
      this.getFixedFilterPart()
    ).subscribe((update) => {
      const currentValue: SearchOptions = this.searchOptions.getValue();
      const updatedValue: SearchOptions = Object.assign(currentValue, update);
      this.searchOptions.next(updatedValue);
    });
  }

  /**
   * Sets up a subscription to all necessary parameters to make sure the paginatedSearchOptions emits a new value every time they update
   * @param {PaginatedSearchOptions} defaults Default values for when no parameters are available
   * @returns {Subscription} The subscription to unsubscribe from
   */
  subscribeToPaginatedSearchOptions(defaults: PaginatedSearchOptions): Subscription {
    return Observable.merge(
      this.getPaginationPart(defaults.pagination),
      this.getSortPart(defaults.sort),
      this.getScopePart(defaults.scope),
      this.getQueryPart(defaults.query),
      this.getDSOTypePart(),
      this.getFiltersPart(),
      this.getFixedFilterPart()
    ).subscribe((update) => {
      const currentValue: PaginatedSearchOptions = this.paginatedSearchOptions.getValue();
      const updatedValue: PaginatedSearchOptions = Object.assign(currentValue, update);
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
        sort: this.defaultSort,
        scope: this.defaultScope,
        query: this.defaultQuery
      });
      this._defaults = Observable.of(new RemoteData(false, false, true, null, options));
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
  }

  /**
   * @returns {Observable<string>} Emits the current scope's identifier
   */
  private getScopePart(defaultScope: string): Observable<any> {
    return this.getCurrentScope(defaultScope).map((scope) => {
      return { scope }
    });
  }

  /**
   * @returns {Observable<string>} Emits the current query string as a partial SearchOptions object
   */
  private getQueryPart(defaultQuery: string): Observable<any> {
    return this.getCurrentQuery(defaultQuery).map((query) => {
      return { query }
    });
  }

  /**
   * @returns {Observable<string>} Emits the current query string as a partial SearchOptions object
   */
  private getDSOTypePart(): Observable<any> {
    return this.getCurrentDSOType().map((dsoType) => {
      return { dsoType }
    });
  }

  /**
   * @returns {Observable<string>} Emits the current pagination settings as a partial SearchOptions object
   */
  private getPaginationPart(defaultPagination: PaginationComponentOptions): Observable<any> {
    return this.getCurrentPagination(defaultPagination).map((pagination) => {
      return { pagination }
    });
  }

  /**
   * @returns {Observable<string>} Emits the current sorting settings as a partial SearchOptions object
   */
  private getSortPart(defaultSort: SortOptions): Observable<any> {
    return this.getCurrentSort(defaultSort).map((sort) => {
      return { sort }
    });
  }

  /**
   * @returns {Observable<Params>} Emits the current active filters as a partial SearchOptions object
   */
  private getFiltersPart(): Observable<any> {
    return this.getCurrentFilters().map((filters) => {
      return { filters }
    });
  }

  /**
   * @returns {Observable<string>} Emits the current fixed filter as a partial SearchOptions object
   */
  private getFixedFilterPart(): Observable<any> {
    return this.getCurrentFixedFilter().map((fixedFilter) => {
      return { fixedFilter }
    });
  }
}
