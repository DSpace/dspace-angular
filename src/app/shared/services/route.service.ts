import { distinctUntilChanged, filter, map, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Params,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { isEqual } from 'lodash';

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
    return this.getQueryParamMap().pipe(
      map((params) => [...params.getAll(paramName)]),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    );
  }

  /**
   * Retrieves a single query parameter values based on a parameter name
   * @param paramName The name of the parameter to look for
   */
  getQueryParameterValue(paramName: string): Observable<string> {
    return this.getQueryParamMap().pipe(
      map((params) => params.get(paramName)),
      distinctUntilChanged()
    );
  }

  /**
   * Checks if the query parameter currently exists in the route
   * @param paramName The name of the parameter to look for
   */
  hasQueryParam(paramName: string): Observable<boolean> {
    return this.getQueryParamMap().pipe(
      map((params) => params.has(paramName)),
      distinctUntilChanged()
    );
  }

  /**
   * Checks if the query parameter with a specific value currently exists in the route
   * @param paramName The name of the parameter to look for
   * @param paramValue The value of the parameter to look for
   */
  hasQueryParamWithValue(paramName: string, paramValue: string): Observable<boolean> {
    return this.getQueryParamMap().pipe(
      map((params) => params.getAll(paramName).indexOf(paramValue) > -1),
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
    return this.getQueryParamMap().pipe(
      map((qparams) => {
        const params = {};
        qparams.keys
          .filter((key) => key.startsWith(prefix))
          .forEach((key) => {
            params[key] = [...qparams.getAll(key)];
          });
        return params;
      }),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    );
  }

  public getQueryParamMap(): Observable<any> {
    return this.route.queryParamMap.pipe(
      map((paramMap) => {
        const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
        // Due to an Angular bug, sometimes change of QueryParam is not detected so double checks with route snapshot
        if (!isEqual(paramMap, snapshot.root.queryParamMap)) {
          return snapshot.root.queryParamMap;
        } else {
          return paramMap;
        }
      }))
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
