import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SearchOptions } from '../search-options.model';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params } from '@angular/router';
import { PaginatedSearchOptions } from '../paginated-search-options.model';
import { Injectable, OnDestroy } from '@angular/core';
import { RouteService } from '../../shared/services/route.service';
import { hasNoValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { RemoteData } from '../../core/data/remote-data';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

/**
 * Service that performs all actions that have to do with the current search configuration
 */
@Injectable()
export class SearchConfigurationService implements OnDestroy {
  private defaultPagination = Object.assign(new PaginationComponentOptions(), {
    id: 'search-page-configuration',
    pageSize: 10,
    currentPage: 1
  });

  private defaultSort = new SortOptions('score', SortDirection.DESC);

  private defaultScope = '';

  private defaultQuery = '';

  private _defaults;

  public searchOptions: BehaviorSubject<SearchOptions>;
  public paginatedSearchOptions: BehaviorSubject<PaginatedSearchOptions>;
  private subs: Subscription[] = new Array();

  constructor(private routeService: RouteService,
              private route: ActivatedRoute) {
    this.defaults.first().subscribe((defRD) => {
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

  subscribeToSearchOptions(defaults: SearchOptions): Subscription {
    return Observable.merge(
      this.getScopePart(defaults.scope),
      this.getQueryPart(defaults.query),
      this.getFiltersPart()
    ).subscribe((update) => {
      const currentValue: SearchOptions = this.searchOptions.getValue();
      const updatedValue: SearchOptions = Object.assign(new SearchOptions(), currentValue, update);
      this.searchOptions.next(updatedValue);
    });
  }

  subscribeToPaginatedSearchOptions(defaults: PaginatedSearchOptions): Subscription {
    return Observable.merge(
      this.getPaginationPart(defaults.pagination),
      this.getSortPart(defaults.sort),
      this.getScopePart(defaults.scope),
      this.getQueryPart(defaults.query),
      this.getFiltersPart()
    ).subscribe((update) => {
      const currentValue: PaginatedSearchOptions = this.paginatedSearchOptions.getValue();
      const updatedValue: PaginatedSearchOptions = Object.assign(new PaginatedSearchOptions(), currentValue, update);
      this.paginatedSearchOptions.next(updatedValue);
    });
  }

  /**
   * Default values for the Search Options
   */
  get defaults(): Observable<RemoteData<PaginatedSearchOptions>> {
    if (hasNoValue(this._defaults)) {
      const options = Object.assign(new PaginatedSearchOptions(), {
        pagination: this.defaultPagination,
        sort: this.defaultSort,
        scope: this.defaultScope,
        query: this.defaultQuery
      });
      this._defaults = Observable.of(new RemoteData(false, false, true, null, options));
    }
    return this._defaults;
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  private getScopePart(defaultScope: string): Observable<any> {
    return this.getCurrentScope(defaultScope).map((scope) => {
      return { scope }
    });
  }

  /**
   * @returns {Observable<string>} Emits the current query string
   */
  private getQueryPart(defaultQuery: string): Observable<any> {
    return this.getCurrentQuery(defaultQuery).map((query) => {
      return { query }
    });
  }

  /**
   * @returns {Observable<string>} Emits the current pagination settings
   */
  private getPaginationPart(defaultPagination: PaginationComponentOptions): Observable<any> {
    return this.getCurrentPagination(defaultPagination).map((pagination) => {
      return { pagination }
    });
  }

  /**
   * @returns {Observable<string>} Emits the current sorting settings
   */
  private getSortPart(defaultSort: SortOptions): Observable<any> {
    return this.getCurrentSort(defaultSort).map((sort) => {
      return { sort }
    });
  }

  /**
   * @returns {Observable<Params>} Emits the current active filters with their values as they are sent to the backend
   */
  private getFiltersPart(): Observable<any> {
    return this.getCurrentFilters().map((filters) => {
      return { filters }
    });
  }
}
