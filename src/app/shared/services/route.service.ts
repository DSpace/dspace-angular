import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ActivatedRoute, convertToParamMap, NavigationExtras, Params,
  Router,
} from '@angular/router';
import { isNotEmpty } from '../empty.util';
import { detect } from 'rxjs-spy';

/**
 * Service to keep track of the current query parameters
 */
@Injectable()
export class RouteService {

  constructor(private route: ActivatedRoute) {
  }

  /**
   * Retrieves all query parameter values based on a parameter name
   * @param paramName The name of the parameter to look for
   */
  getQueryParameterValues(paramName: string): Observable<string[]> {
    return this.route.queryParamMap.pipe(
      map((params) => [...params.getAll(paramName)]),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    );
  }

  /**
   * Retrieves a single query parameter values based on a parameter name
   * @param paramName The name of the parameter to look for
   */
  getQueryParameterValue(paramName: string): Observable<string> {
    return this.route.queryParamMap.pipe(
      map((params) => params.get(paramName)),
      distinctUntilChanged()
    );
  }

  /**
   * Checks if the query parameter currently exists in the route
   * @param paramName The name of the parameter to look for
   */
  hasQueryParam(paramName: string): Observable<boolean> {
    return this.route.queryParamMap.pipe(
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
    return this.route.queryParamMap.pipe(
      map((params) => params.getAll(paramName).indexOf(paramValue) > -1),
      distinctUntilChanged()
    );
  }

  /**
   * Retrieves all query parameters of which the parameter name starts with the given prefix
   * @param prefix The prefix of the parameter name to look for
   */
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
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    );
  }
}
