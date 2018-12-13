import { Injectable } from '@angular/core';
import {
  ActivatedRoute, convertToParamMap, NavigationEnd, NavigationExtras, Params,
  Router,
} from '@angular/router';

import { distinctUntilChanged, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { isNotEmpty } from '../empty.util';

@Injectable()
export class RouteService {

  private history = [];

  constructor(private route: ActivatedRoute, private router: Router) {
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
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),);
  }

  public saveRouting(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(({urlAfterRedirects}: NavigationEnd) => {
        this.history = [...this.history, urlAfterRedirects];
      });
  }

  public getHistory(): string[] {
    return this.history;
  }

  public getPreviousUrl(): string {
    return this.history[this.history.length - 2] || '';
  }

}
