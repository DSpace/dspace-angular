import { distinctUntilChanged, map, mergeMap, filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router, } from '@angular/router';

import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { AppState } from '../../app.reducer';
import { AddUrlToHistoryAction } from '../history/history.actions';
import { historySelector } from '../history/selectors';

/**
 * Service to keep track of the current query parameters
 */
@Injectable()
export class RouteService {
  params: Observable<Params>;

  constructor(private route: ActivatedRoute, private router: Router, private store: Store<AppState>) {
    this.subscribeToRouterParams();

  }

  /**
   * Retrieves all query parameter values based on a parameter name
   * @param paramName The name of the parameter to look for
   */
  getQueryParameterValues(paramName: string): Observable<string[]> {
    return this.route.queryParamMap.pipe(
      map((paramMap) => [...paramMap.getAll(paramName)]),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    );
  }

  /**
   * Retrieves a single query parameter values based on a parameter name
   * @param paramName The name of the parameter to look for
   */
  getQueryParameterValue(paramName: string): Observable<string> {
    return this.route.queryParamMap.pipe(
      map((paramMap) => paramMap.get(paramName)),
      distinctUntilChanged()
    );
  }

  /**
   * Checks if the query parameter currently exists in the route
   * @param paramName The name of the parameter to look for
   */
  hasQueryParam(paramName: string): Observable<boolean> {
    return this.route.queryParamMap.pipe(
      map((paramMap) => paramMap.has(paramName)),
      distinctUntilChanged()
    );
  }

  /**
   * Checks if the query parameter with a specific value currently exists in the route
   * @param paramName The name of the parameter to look for
   * @param paramValue The value of the parameter to look for
   */
  hasQueryParamWithValue(paramName: string, paramValue: string): Observable<boolean> {
    return this.route.queryParamMap.pipe(
      map((paramMap) => paramMap.getAll(paramName).indexOf(paramValue) > -1),
      distinctUntilChanged()
    );
  }

  getRouteParameterValue(paramName: string): Observable<string> {
    return this.params.pipe(map((params) => params[paramName]),distinctUntilChanged(),);
  }

  getRouteDataValue(datafield: string): Observable<any> {
    return this.route.data.pipe(map((data) => data[datafield]),distinctUntilChanged(),);
  }

  /**
   * Retrieves all query parameters of which the parameter name starts with the given prefix
   * @param prefix The prefix of the parameter name to look for
   */
  getQueryParamsWithPrefix(prefix: string): Observable<Params> {
    return this.route.queryParamMap.pipe(
      map((paramMap) => {
        const params = {};
        paramMap.keys
          .filter((key) => key.startsWith(prefix))
          .forEach((key) => {
            params[key] = [...paramMap.getAll(key)];
          });
        return params;
      }),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    );
  }

  public saveRouting(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        this.store.dispatch(new AddUrlToHistoryAction(urlAfterRedirects))
      });
  }

  subscribeToRouterParams() {
    this.params = this.router.events.pipe(
      mergeMap((event) => {
        let active = this.route;
        while (active.firstChild) {
          active = active.firstChild;
        }
        return active.params;
      })
    );
  }

  public getHistory(): Observable<string[]> {
    return this.store.pipe(select(historySelector));
  }

  public getPreviousUrl(): Observable<string> {
    return this.getHistory().pipe(
      map((history: string[]) => history[history.length - 2] || '')
    );
  }

}
