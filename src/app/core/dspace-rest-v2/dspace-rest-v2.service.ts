import { Inject, Injectable } from '@angular/core';
import { Http, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';
import { DSpaceRESTV2Response } from './dspace-rest-v2-response.model';

import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';

/**
 * Service to access DSpace's REST API
 */
@Injectable()
export class DSpaceRESTv2Service {

  constructor(private http: Http, @Inject(GLOBAL_CONFIG) private EnvConfig: GlobalConfig) {

  }

  /**
   * Performs a request to the REST API with the `get` http method.
   *
   * @param absoluteURL
   *      A URL
   * @param options
   *      A RequestOptionsArgs object, with options for the http call.
   * @return {Observable<string>}
   *      An Observable<string> containing the response from the server
   */
  get(absoluteURL: string, options?: RequestOptionsArgs): Observable<DSpaceRESTV2Response> {
    return this.http.get(absoluteURL, options)
      .map((res) => ({ payload: res.json(), statusCode: res.statusText }))
      .catch((err) => {
        console.log('Error: ', err);
        return Observable.throw(err);
      });
  }

}
