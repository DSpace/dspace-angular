import {
  EMPTY,
  of,
} from 'rxjs';

export const routeServiceStub: any = {
  /* eslint-disable no-empty,@typescript-eslint/no-empty-function */
  hasQueryParamWithValue: (param: string, value: string) => {
    return EMPTY;
  },
  hasQueryParam: (param: string) => {
    return EMPTY;
  },
  removeQueryParameterValue: (param: string, value: string) => {
    return EMPTY;
  },
  addQueryParameterValue: (param: string, value: string) => {
    return EMPTY;
  },
  getQueryParameterValues: (param: string) => {
    return of({});
  },
  getQueryParamsWithPrefix: (param: string) => {
    return of({});
  },
  getQueryParamMap: () => {
    return of(new Map());
  },
  getQueryParameterValue: () => {
    return of({});
  },
  getRouteParameterValue: (param) => {
    return of('');
  },
  getRouteDataValue: (param) => {
    return of({});
  },
  getHistory: () => {
    return of(['/home', '/collection/123', '/home']);
  },
  getPreviousUrl: () => {
    return of('/home');
  },
  // Added generic session helpers used by ItemComponent
  storeUrlInSession: (key: string, url: string) => {
    // no-op for tests
  },
  getUrlFromSession: (key: string): string | null => {
    return null;
  },
  clearUrlFromSession: (key: string) => {
    // no-op for tests
  },
  setParameter: (key: any, value: any) => {
    return;
  },
  /* eslint-enable no-empty, @typescript-eslint/no-empty-function */
};
