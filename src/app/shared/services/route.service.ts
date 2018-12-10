import { distinctUntilChanged, map, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params, Router, } from '@angular/router';

@Injectable()
export class RouteService {
  params: Observable<Params>;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.subscribeToRouterParams();

  }

  getQueryParameterValues(paramName: string): Observable<string[]> {
    return this.route.queryParamMap.pipe(
      map((paramMap) => [...paramMap.getAll(paramName)]),
      distinctUntilChanged()
    );
  }

  getQueryParameterValue(paramName: string): Observable<string> {
    return this.route.queryParamMap.pipe(
      map((paramMap) => paramMap.get(paramName)),
      distinctUntilChanged()
    );
  }

  hasQueryParam(paramName: string): Observable<boolean> {
    return this.route.queryParamMap.pipe(
      map((paramMap) => paramMap.has(paramName)),
      distinctUntilChanged()
    );
  }

  hasQueryParamWithValue(paramName: string, paramValue: string): Observable<boolean> {
    return this.route.queryParamMap.pipe(
      map((paramMap) => paramMap.getAll(paramName).indexOf(paramValue) > -1),
      distinctUntilChanged()
    );
  }

  getRouteParameterValue(paramName: string): Observable<string> {
    return this.params.map((params) => params[paramName]).distinctUntilChanged();
  }

  getRouteDataValue(datafield: string): Observable<any> {
    return this.route.data.map((data) => data[datafield]).distinctUntilChanged();
  }

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
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)));
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
}
