import { of as observableOf } from 'rxjs/internal/observable/of';

export const routeServiceStub: any = {
  /* tslint:disable:no-empty */
  hasQueryParamWithValue: (param: string, value: string) => {
  },
  hasQueryParam: (param: string) => {
  },
  removeQueryParameterValue: (param: string, value: string) => {
  },
  addQueryParameterValue: (param: string, value: string) => {
  },
  getQueryParameterValues: (param: string) => {
    return observableOf({});
  },
  getQueryParamsWithPrefix: (param: string) => {
    return observableOf({});
  },
  getQueryParamMap: () => {
    return observableOf(new Map())
  },
  getQueryParameterValue: () => {
    return observableOf({})
  },
  getRouteParameterValue: (param) => {
    return observableOf('')
  },
  getRouteDataValue: (param) => {
    return observableOf({})
  },
  getHistory: () => {
    return observableOf(['/home','/collection/123','/home'])
  }
  /* tslint:enable:no-empty */
};
