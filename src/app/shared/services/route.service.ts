import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  ActivatedRoute, convertToParamMap, NavigationExtras, Params,
  Router,
} from '@angular/router';
import { isNotEmpty } from '../empty.util';

@Injectable()
export class RouteService {

  constructor(private route: ActivatedRoute) {
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
        })
      .distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b));
  }
}
