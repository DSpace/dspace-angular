import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router, } from '@angular/router';

import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { AppState } from '../../app.reducer';
import { AddUrlToHistoryAction } from '../history/history.actions';
import { historySelector } from '../history/selectors';

@Injectable()
export class RouteService {

  constructor(private route: ActivatedRoute, private router: Router, private store: Store<AppState>) {
  }

  getQueryParameterValues(paramName: string): Observable<string[]> {
    return this.route.queryParamMap.pipe(
      map((params) => [...params.getAll(paramName)]),
      distinctUntilChanged()
    );
  }

  getQueryParameterValue(paramName: string): Observable<string> {
    return this.route.queryParamMap.pipe(
      map((params) => params.get(paramName)),
      distinctUntilChanged()
    );
  }

  hasQueryParam(paramName: string): Observable<boolean> {
    return this.route.queryParamMap.pipe(
      map((params) => params.has(paramName)),
      distinctUntilChanged()
    );
  }

  hasQueryParamWithValue(paramName: string, paramValue: string): Observable<boolean> {
    return this.route.queryParamMap.pipe(
      map((params) => params.getAll(paramName).indexOf(paramValue) > -1),
      distinctUntilChanged()
    );
  }

  getQueryParamsWithPrefix(prefix: string): Observable<Params> {
    return this.route.queryParamMap.pipe(
      map((qparams) => {
        const params = {};
        qparams.keys
          .filter((key) => key.startsWith(prefix))
          .forEach((key) => {
            params[key] = [...qparams.getAll(key)];
          });
        return params;
      }),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)));
  }

  public saveRouting(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(({urlAfterRedirects}: NavigationEnd) => {
        this.store.dispatch(new AddUrlToHistoryAction(urlAfterRedirects))
      });
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
