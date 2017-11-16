import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, convertToParamMap, Params, } from '@angular/router';
import { isNotEmpty } from './empty.util';

@Injectable()
export class RouteService {

  constructor(private route: ActivatedRoute) {
  }

  getQueryParameterValues(paramName: string): Observable<string[]> {
    return this.route.queryParamMap.map((map) => map.getAll(paramName));
  }

  getQueryParameterValue(paramName: string): Observable<string> {
    return this.route.queryParamMap.map((map) => map.get(paramName));
  }

  hasQueryParam(paramName: string): Observable<boolean> {
    return this.route.queryParamMap.map((map) => {return map.has(paramName);});
  }

  hasQueryParamWithValue(paramName: string, paramValue: string): Observable<boolean> {
    return this.route.queryParamMap.map((map) => map.getAll(paramName).indexOf(paramValue) > -1);
  }


  addQueryParameterValue(paramName: string, paramValue: string): Observable<Params> {
    return this.route.queryParams.map((currentParams) => {
      const newParam = {};
      newParam[paramName] = [...convertToParamMap(currentParams).getAll(paramName), paramValue];
      return Object.assign({}, currentParams, newParam);
    });
  }

  removeQueryParameterValue(paramName: string, paramValue: string): Observable<Params> {
    return this.route.queryParams.map((currentParams) => {
      const newParam = {};
      const currentFilterParams = convertToParamMap(currentParams).getAll(paramName);
      if (isNotEmpty(currentFilterParams)) {
        newParam[paramName] = currentFilterParams.filter((param) => (param !== paramValue));
      }
      return Object.assign({}, currentParams, newParam);
    });
  }

  removeQueryParameter(paramName: string): Observable<Params> {
    return this.route.queryParams.map((currentParams) => {
      const newParam = {};
      newParam[paramName] = {};
      return Object.assign({}, currentParams, newParam);
    });

  }
}
