import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Params, Router, } from '@angular/router';
import { filter, flatMap, map } from 'rxjs/operators';

@Injectable()
export class RouteService {
  params: Observable<Params>;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.subscribeToRouterParams();

  }

  getQueryParameterValues(paramName: string): Observable<string[]> {
    return this.route.queryParamMap.map((paramMap) => [...paramMap.getAll(paramName)]).distinctUntilChanged();
  }

  getQueryParameterValue(paramName: string): Observable<string> {
    return this.route.queryParamMap.map((paramMap) => paramMap.get(paramName)).distinctUntilChanged();
  }

  hasQueryParam(paramName: string): Observable<boolean> {
    return this.route.queryParamMap.map((paramMap) => paramMap.has(paramName)).distinctUntilChanged();
  }

  hasQueryParamWithValue(paramName: string, paramValue: string): Observable<boolean> {
    return this.route.queryParamMap.map((paramMap) => paramMap.getAll(paramName).indexOf(paramValue) > -1).distinctUntilChanged();
  }

  getRouteParameterValue(paramName: string): Observable<string> {
    return this.params.map((params) => params[paramName]).distinctUntilChanged();
  }

  getRouteDataValue(datafield: string): Observable<any> {
    return this.route.data.map((data) => data[datafield]).distinctUntilChanged();
  }

  getQueryParamsWithPrefix(prefix: string): Observable<Params> {
    return this.route.queryParamMap
      .map((paramMap) => {
        const params = {};
        paramMap.keys
          .filter((key) => key.startsWith(prefix))
          .forEach((key) => {
            params[key] = [...paramMap.getAll(key)];
          });
        return params;
      }).distinctUntilChanged();
  }

  subscribeToRouterParams() {
    this.params = this.router.events.pipe(
      flatMap((event) => {
        let active = this.route;
        while (active.firstChild) {
          active = active.firstChild;
        }
        return active.params;
      })
    );
  }
}
