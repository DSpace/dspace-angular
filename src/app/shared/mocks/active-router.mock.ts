import { Params } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export class MockActivatedRoute {

  private _testParams?: any;
  private _testUrl?: any;

  // ActivatedRoute.params is Observable
  private subject?: BehaviorSubject<any> = new BehaviorSubject(this.testParams);
  // ActivatedRoute.url is Observable
  private urlSubject?: BehaviorSubject<any> = new BehaviorSubject(this.testUrl);

  params = this.subject.asObservable();
  queryParams = this.subject.asObservable();
  url = this.urlSubject.asObservable();

  constructor(params?: Params, url?: any) {
    if (params) {
      this.testParams = params;
    } else {
      this.testParams = {};
    }

    if (url) {
      this.testUrl = url;
    } else {
      this.testUrl = {};
    }
  }

  // Test parameters
  get testParams() { return this._testParams; }
  set testParams(params: any) {
    this._testParams = params;
    this.subject.next(params);
  }

  // ActivatedRoute.snapshot.params
  get snapshot() {
    return { params: this.testParams, queryParams: this.testParams };
  }

  //ActivatedRoute.url
  get testUrl() { return this._testUrl; }
  set testUrl(url: any) {
    this._testUrl = url;
    this.urlSubject.next(url);
  }
}
