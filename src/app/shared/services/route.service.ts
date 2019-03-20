import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ActivatedRoute, convertToParamMap, NavigationExtras, Params,
  Router,
} from '@angular/router';
import { isNotEmpty } from '../empty.util';
import { detect } from 'rxjs-spy';

@Injectable()
export class RouteService {

  constructor(private route: ActivatedRoute) {
  }

  getQueryParameterValues(paramName: string): Observable<string[]> {
    console.log('called');
    return this.route.queryParamMap.pipe(
      map((params) => [...params.getAll(paramName)]),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
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
        console.log('map');
        const params = {};
        qparams.keys
          .filter((key) => key.startsWith(prefix))
          .forEach((key) => {
            params[key] = [...qparams.getAll(key)];
          });
        return params;
      }),
      distinctUntilChanged((a, b) => { console.log('changed?', a, b, JSON.stringify(a) === JSON.stringify(b)); return JSON.stringify(a) === JSON.stringify(b)}),
      tap((t) => console.log('changed'))
    );
  }
}
