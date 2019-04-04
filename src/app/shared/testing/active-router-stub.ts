
import {map} from 'rxjs/operators';
import { convertToParamMap, ParamMap, Params } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

export class ActivatedRouteStub {

  private _testParams?: any;
  // ActivatedRoute.params is Observable
  private subject?: BehaviorSubject<any> = new BehaviorSubject(this.testParams);

  params = this.subject.asObservable();
  queryParams = this.subject.asObservable();
  paramMap = this.subject.asObservable().pipe(map((params: Params) => convertToParamMap(params)));;
  queryParamMap = this.subject.asObservable().pipe(map((params: Params) => convertToParamMap(params)));

  constructor(params?: Params) {
    if (params) {
      this.testParams = params;
    } else {
      this.testParams = {};
    }
  }

  // Test parameters
  get testParams() {
    return this._testParams;
  }

  set testParams(params: {}) {
    this._testParams = params;
    this.subject.next(params);
  }

  // ActivatedRoute.snapshot.params
  get snapshot() {
    return {
      params: this.testParams,
      queryParamMap: convertToParamMap(this.testParams)
    }
  }
}
