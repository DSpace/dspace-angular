import {
  ActivatedRoute,
  convertToParamMap,
  Data,
  Params,
} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export class ActivatedRouteStub {

  private _testParams?: Params;
  private _testData?: Data;
  // ActivatedRoute.params is Observable
  private subject?: BehaviorSubject<Params> = new BehaviorSubject(this.testParams);
  private dataSubject?: BehaviorSubject<Data> = new BehaviorSubject(this.testData);

  params = this.subject.asObservable();
  queryParams = this.subject.asObservable();
  paramMap = this.subject.asObservable().pipe(map((params: Params) => convertToParamMap(params)));
  parent: ActivatedRoute | ActivatedRouteStub;
  queryParamMap = this.subject.asObservable().pipe(map((params: Params) => convertToParamMap(params)));
  data = this.dataSubject.asObservable();

  constructor(params?: Params, data?: any) {
    if (params) {
      this.testParams = params;
    } else {
      this.testParams = {};
    }
    if (data) {
      this.testData = data;
    } else {
      this.testData = {};
    }
  }

  // Test parameters
  get testParams() {
    return this._testParams;
  }

  set testParams(params: Params) {
    this._testParams = params;
    this.subject.next(params);
  }

  // Test data
  get testData() {
    return this._testData;
  }

  set testData(data: Data) {
    this._testData = data;
    this.dataSubject.next(data);
  }

  // ActivatedRoute.snapshot.params
  get snapshot() {
    return {
      params: this.testParams,
      paramMap: convertToParamMap(this.params),
      queryParamMap: convertToParamMap(this.testParams),
      queryParams: {} as Params,
      data: this.testData,
    };
  }
}
