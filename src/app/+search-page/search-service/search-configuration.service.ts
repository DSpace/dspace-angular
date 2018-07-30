import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SearchOptions } from '../search-options.model';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params } from '@angular/router';
import { PaginatedSearchOptions } from '../paginated-search-options.model';
import { Injectable } from '@angular/core';
import { RouteService } from '../../shared/services/route.service';
import { hasNoValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { RemoteData } from '../../core/data/remote-data';

/**
 * Service that performs all actions that have to do with the current search configuration
 */
@Injectable()
export class SearchConfigurationService {
  private defaultPagination = { id: 'search-page-configuration', pageSize: 10 };

  private defaultSort = new SortOptions('score', SortDirection.DESC);

  private defaultScope = '';

  private _defaults;

  constructor(private routeService: RouteService,
              private route: ActivatedRoute) {

  }

  /**
   * @returns {Observable<string>} Emits the current scope's identifier
   */
  getCurrentScope() {
    return this.routeService.getQueryParameterValue('scope');
  }

  /**
   * @returns {Observable<string>} Emits the current query string
   */
  getCurrentQuery() {
    return this.routeService.getQueryParameterValue('query');
  }

  /**
   * @returns {Observable<string>} Emits the current pagination settings
   */
  getCurrentPagination(pagination: any = {}): Observable<PaginationComponentOptions> {
    const page$ = this.routeService.getQueryParameterValue('page');
    const size$ = this.routeService.getQueryParameterValue('pageSize');
    return Observable.combineLatest(page$, size$, (page, size) => {
      return Object.assign(new PaginationComponentOptions(), pagination, {
        currentPage: page || 1,
        pageSize: size || pagination.pageSize
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
    );
  }

  /**
   * @returns {Observable<Params>} Emits the current active filters with their values as they are sent to the backend
   */
  getCurrentFilters(): Observable<Params> {
    return this.routeService.getQueryParamsWithPrefix('f.').map((filterParams) => {
      if (isNotEmpty(filterParams)) {
        const params = {};
        Object.keys(filterParams).forEach((key) => {
          if (key.endsWith('.min') || key.endsWith('.max')) {
            const realKey = key.slice(0, -4);
            if (isEmpty(params[realKey])) {
              const min = filterParams[realKey + '.min'] ? filterParams[realKey + '.min'][0] : '*';
              const max = filterParams[realKey + '.max'] ? filterParams[realKey + '.max'][0] : '*';
              params[realKey] = ['[' + min + ' TO ' + max + ']'];
            }
          } else {
            params[key] = filterParams[key];
          }
        });
        return params;
      }
      return filterParams;
    });
  }

  /**
   * @returns {Observable<Params>} Emits the current active filters with their values as they are displayed in the frontend URL
   */
  getCurrentFrontendFilters(): Observable<Params> {
    return this.routeService.getQueryParamsWithPrefix('f.');
  }

  /**
   * @param defaults The default values for the search options, that will be used if nothing is explicitly set
   * @returns {Observable<PaginatedSearchOptions>} Emits the current paginated search options
   */
  getPaginatedSearchOptions(defaults: Observable<RemoteData<any>> = this.defaults): Observable<PaginatedSearchOptions> {
    return defaults.flatMap((defaultConfig) => {
      const defaultValues = defaultConfig.payload;
      return Observable.combineLatest(
        this.getCurrentPagination(defaultValues.pagination),
        this.getCurrentSort(defaultValues.sort),
        this.getCurrentScope(),
        this.getCurrentQuery(),
        this.getCurrentFilters()).pipe(
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        map(([pagination, sort, scope, query, filters]) => {
          return Object.assign(new PaginatedSearchOptions(),
            defaults,
            {
              pagination: pagination,
              sort: sort,
              scope: scope || defaultValues.scope,
              query: query,
              filters: filters
            })
        })
      )
    });
  }

  /**
   * @param defaults The default values for the search options, that will be used if nothing is explicitly set
   * @returns {Observable<PaginatedSearchOptions>} Emits the current search options
   */
  getSearchOptions(defaults: Observable<RemoteData<any>> = this.defaults): Observable<SearchOptions> {
    return defaults.flatMap((defaultConfig) => {
      const defaultValues = defaultConfig.payload;
      return Observable.combineLatest(
        this.getCurrentScope(),
        this.getCurrentQuery(),
        this.getCurrentFilters(),
        (scope, query, filters) => {
          return Object.assign(new SearchOptions(),
            {
              scope: scope || defaultValues.scope,
              query: query,
              filters: filters
            })
        }
      )
    });
  }

  /**
   * Default values for the Search Options
   */
  get defaults() {
    if (hasNoValue(this._defaults)) {
      const options = {
        pagination: this.defaultPagination,
        sort: this.defaultSort,
        scope: this.defaultScope
      };
      this._defaults = Observable.of(new RemoteData(false, false, true, null, options));
    }
    return this._defaults;
  }
}
