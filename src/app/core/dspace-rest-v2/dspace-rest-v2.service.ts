import { Inject, Injectable } from '@angular/core';
import { Http, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { RESTURLCombiner } from "../url-combiner/rest-url-combiner";

import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';

/**
 * Service to access DSpace's REST API
 */
@Injectable()
export class DSpaceRESTv2Service {
  constructor(private http: Http, @Inject(GLOBAL_CONFIG) private config: GlobalConfig) {

  }

  /**
   * Performs a request to the REST API with the `get` http method.
   *
   * @param relativeURL
   *      A URL, relative to the basepath of the rest api
   * @param options
   *      A RequestOptionsArgs object, with options for the http call.
   * @return {Observable<string>}
   *      An Observablse<string> containing the response from the server
   */
  get(relativeURL: string, options?: RequestOptionsArgs): Observable<string> {
    return this.http.get(new RESTURLCombiner(this.config, relativeURL).toString(), options)
      .map(res => res.json())
      .catch(err => {
        console.log('Error: ', err);
        return Observable.throw(err);
      });
  }

}
