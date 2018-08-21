import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, NavigationEnd, Params, Router, } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable()
export class RouteService {
  params: Observable<Params>;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.subscribeToRouterParams();

  }

  getQueryParameterValues(paramName: string): Observable<string[]> {
    return this.route.queryParamMap.map((map) => [...map.getAll(paramName)]).distinctUntilChanged();
  }

  getQueryParameterValue(paramName: string): Observable<string> {
    return this.route.queryParamMap.map((map) => map.get(paramName)).distinctUntilChanged();
  }

  hasQueryParam(paramName: string): Observable<boolean> {
    return this.route.queryParamMap.map((map) => map.has(paramName)).distinctUntilChanged();
  }

  hasQueryParamWithValue(paramName: string, paramValue: string): Observable<boolean> {
    return this.route.queryParamMap.map((map) => map.getAll(paramName).indexOf(paramValue) > -1).distinctUntilChanged();
  }

  getRouteParameterValue(paramName: string): Observable<string> {
    return this.params.map((params) => params[paramName]).distinctUntilChanged();
  }

  getRouteDataValue(datafield: string): Observable<any> {
    return this.route.data.map((data) => data[datafield]).distinctUntilChanged();
  }

  getQueryParamsWithPrefix(prefix: string): Observable<Params> {
    return this.route.queryParamMap
      .map((map) => {
        const params = {};
        map.keys
          .filter((key) => key.startsWith(prefix))
          .forEach((key) => {
            params[key] = [...map.getAll(key)];
          });
        return params;
      }).distinctUntilChanged();
  }

  subscribeToRouterParams() {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        let active = this.route;
        while (active.firstChild) {
          active = active.firstChild;
        }
        this.params = active.params;
      });
  }
}
