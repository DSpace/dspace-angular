import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params, Router, RouterStateSnapshot, } from '@angular/router';
import { isEqual } from 'lodash';

@Injectable()
export class RouteService {

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  getQueryParameterValues(paramName: string): Observable<string[]> {
    return this.getQueryParamMap().map((map) => [...map.getAll(paramName)]).distinctUntilChanged();
  }

  getQueryParameterValue(paramName: string): Observable<string> {
    return this.getQueryParamMap().map((map) => map.get(paramName)).distinctUntilChanged();
  }

  hasQueryParam(paramName: string): Observable<boolean> {
    return this.getQueryParamMap().map((map) => map.has(paramName)).distinctUntilChanged();
  }

  hasQueryParamWithValue(paramName: string, paramValue: string): Observable<boolean> {
    return this.getQueryParamMap().map((map) => map.getAll(paramName).indexOf(paramValue) > -1).distinctUntilChanged();
  }

  getQueryParamsWithPrefix(prefix: string): Observable<Params> {
    return this.getQueryParamMap()
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

  public getQueryParamMap(): Observable<any> {
    return this.route.queryParamMap.map((map) => {
      const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
      // Due to an Angular bug, sometimes change of QueryParam is not detected so double checks with route snapshot
      if (!isEqual(map, snapshot.root.queryParamMap)) {
        return snapshot.root.queryParamMap;
      } else {
        return map;
      }
    })
  }
}
