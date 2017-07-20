import { Injectable } from '@angular/core';
import { ConnectionBackend, Http, Request, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { TransferState } from '../transfer-state/transfer-state';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';

@Injectable()
export class TransferHttp {

  constructor(private http: Http, protected transferState: TransferState) { }

  request(uri: string | Request, options?: RequestOptionsArgs): Observable<any> {
    // tslint:disable-next-line:no-shadowed-variable
    return this.getData(uri, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.request(url, options);
    });
  }

  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    // tslint:disable-next-line:no-shadowed-variable
    return this.getData(url, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.get(url, options);
    });
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    // tslint:disable-next-line:no-shadowed-variable
    return this.getPostData(url, body, options, (url: string, body: any, options: RequestOptionsArgs) => {
      return this.http.post(url, body, options);
    });
  }

  put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    // tslint:disable-next-line:no-shadowed-variable
    return this.getData(url, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.put(url, options);
    });
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    // tslint:disable-next-line:no-shadowed-variable
    return this.getData(url, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.delete(url, options);
    });
  }

  patch(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    // tslint:disable-next-line:no-shadowed-variable
    return this.getPostData(url, body, options, (url: string, body: any, options: RequestOptionsArgs) => {
      return this.http.patch(url, body, options);
    });
  }

  head(url: string, options?: RequestOptionsArgs): Observable<any> {
    // tslint:disable-next-line:no-shadowed-variable
    return this.getData(url, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.head(url, options);
    });
  }

  options(url: string, options?: RequestOptionsArgs): Observable<any> {
    // tslint:disable-next-line:no-shadowed-variable
    return this.getData(url, options, (url: string, options: RequestOptionsArgs) => {
      return this.http.options(url, options);
    });
  }

  // tslint:disable-next-line:max-line-length
  private getData(uri: string | Request, options: RequestOptionsArgs, callback: (uri: string | Request, options?: RequestOptionsArgs) => Observable<Response>) {

    let url = uri;

    if (typeof uri !== 'string') {
      url = uri.url;
    }

    const key = url + JSON.stringify(options);

    try {
      return this.resolveData(key);
    } catch (e) {
      return callback(uri, options)
        .map((res: Response) => res.json())
        .do((data: any) => {
          this.setCache(key, data);
        });
    }
  }

  private getPostData(uri: string | Request, body: any, options: RequestOptionsArgs, callback: (uri: string | Request, body: any, options?: RequestOptionsArgs) => Observable<Response>) {

    let url = uri;

    if (typeof uri !== 'string') {
      url = uri.url;
    }

    const key = url + JSON.stringify(body) + JSON.stringify(options);

    try {
      return this.resolveData(key);
    } catch (e) {
      return callback(uri, body, options)
        .map((res: Response) => res.json())
        .do((data: any) => {
          this.setCache(key, data);
        });
    }
  }

  private resolveData(key: string) {
    const data = this.getFromCache(key);
    if (!data) {
      throw new Error();
    }
    return Observable.of(data);
  }

  private setCache(key, data) {
    return this.transferState.set(key, data);
  }

  private getFromCache(key): any {
    return this.transferState.get(key);
  }

}
