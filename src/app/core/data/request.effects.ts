import {
  Injectable,
  Injector,
} from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, mergeMap, take, withLatestFrom } from 'rxjs/operators';

import {
  hasValue,
  isNotEmpty,
} from '../../shared/empty.util';
import { StoreActionTypes } from '../../store.actions';
import { getClassForObject } from '../cache/builders/build-decorators';
import { ParsedResponse } from '../cache/response.models';
import { DspaceRestService } from '../dspace-rest/dspace-rest.service';
import { DSpaceSerializer } from '../dspace-rest/dspace.serializer';
import { XSRFService } from '../xsrf/xsrf.service';
import {
  RequestActionTypes,
  RequestErrorAction,
  RequestExecuteAction,
  RequestSuccessAction,
  ResetResponseTimestampsAction,
} from './request.actions';
import { RequestService } from './request.service';
import { RequestError } from './request-error.model';
import { RestRequestMethod } from './rest-request-method';
import { RestRequestWithResponseParser } from './rest-request-with-response-parser.model';
import { RequestEntry } from './request-entry.model';
import { RawRestResponse } from '../dspace-rest/raw-rest-response.model';

@Injectable()
export class RequestEffects {

   execute = createEffect(() => this.actions$.pipe(
    ofType(RequestActionTypes.EXECUTE),
    mergeMap((action: RequestExecuteAction) => {
      return this.requestService.getByUUID(action.payload).pipe(
        take(1)
      );
    }),
    filter((entry: RequestEntry) => hasValue(entry)),
    withLatestFrom(this.xsrfService.tokenInitialized$),
    // If it's a GET request, or we have an XSRF token, dispatch it immediately
    // Otherwise wait for the XSRF token first
    filter(([entry, tokenInitialized]: [RequestEntry, boolean]) => entry.request.method === RestRequestMethod.GET || tokenInitialized === true),
    map(([entry, tokenInitialized]: [RequestEntry, boolean]) => entry.request),
    mergeMap((request: RestRequestWithResponseParser) => {
      let body = request.body;
      if (isNotEmpty(request.body) && !request.isMultipart) {
        const serializer = new DSpaceSerializer(getClassForObject(request.body));
        body = serializer.serialize(request.body);
      }
      return this.restApi.request(request.method, request.href, body, request.options, request.isMultipart).pipe(
        map((data: RawRestResponse) => this.injector.get(request.getResponseParser()).parse(request, data)),
        map((response: ParsedResponse) => new RequestSuccessAction(request.uuid, response.statusCode, response.link, response.unCacheableObject)),
        catchError((error: RequestError) => {
          if (hasValue(error.statusCode)) {
            // if it's an error returned by the server, complete the request
            return [new RequestErrorAction(request.uuid, error.statusCode, error.message)];
          } else {
            // if it's a client side error, throw it
            throw error;
          }
        })
      );
    })
  ));

  /**
   * When the store is rehydrated in the browser, set all cache
   * timestamps to 'now', because the time zone of the server can
   * differ from the client.
   *
   * This assumes that the server cached everything a negligible
   * time ago, and will likely need to be revisited later
   */
   fixTimestampsOnRehydrate = createEffect(() => this.actions$
    .pipe(ofType(StoreActionTypes.REHYDRATE),
      map(() => new ResetResponseTimestampsAction(new Date().getTime()))
    ));

  constructor(
    private actions$: Actions,
    private restApi: DspaceRestService,
    private injector: Injector,
    protected requestService: RequestService,
    protected xsrfService: XSRFService,
  ) { }

}
