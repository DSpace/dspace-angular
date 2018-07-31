import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable()
export class RouteService {

  private history = [];

  constructor(private route: ActivatedRoute, private router: Router) {
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
        }).distinctUntilChanged();
  }

  public saveRouting(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(({urlAfterRedirects}: NavigationEnd) => {
        this.history = [...this.history, urlAfterRedirects];
        console.log(this.history);
      });
  }

  public getHistory(): string[] {
    return this.history;
  }

  public getPreviousUrl(): string {
    return this.history[this.history.length - 2] || '';
  }

}
