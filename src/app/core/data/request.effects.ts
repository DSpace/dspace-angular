import { Injectable, Injector } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, mergeMap, take } from 'rxjs/operators';

import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { StoreActionTypes } from '../../store.actions';
import { getClassForType } from '../cache/builders/build-decorators';
import { RawRestResponse } from '../dspace-rest/raw-rest-response.model';
import { DspaceRestService } from '../dspace-rest/dspace-rest.service';
import { DSpaceSerializer } from '../dspace-rest/dspace.serializer';
import {
  RequestActionTypes,
  RequestErrorAction,
  RequestExecuteAction,
  RequestSuccessAction,
  ResetResponseTimestampsAction
} from './request.actions';
import { RequestService } from './request.service';
import { ParsedResponse } from '../cache/response.models';
import { RequestError } from './request-error.model';
import { RestRequestWithResponseParser } from './rest-request-with-response-parser.model';
import { RequestEntry } from './request-entry.model';
import { ServerStatusService } from '../server-check/server-status.service';

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
    map((entry: RequestEntry) => entry.request),
    mergeMap((request: RestRequestWithResponseParser) => {
      let body = request.body;
      if (isNotEmpty(request.body) && !request.isMultipart) {
        const serializer = new DSpaceSerializer(getClassForType(request.body.type));
        body = serializer.serialize(request.body);
      }
      return this.restApi.request(request.method, request.href, body, request.options, request.isMultipart).pipe(
        map((data: RawRestResponse) => this.injector.get(request.getResponseParser()).parse(request, data)),
        map((response: ParsedResponse) => new RequestSuccessAction(request.uuid, response.statusCode, response.link, response.unCacheableObject)),
        catchError((error: RequestError) => {
          if (hasValue(error.statusCode)) {
            // if it's an error returned by the server, check if the server is still running and update its status
            // then navigate to the internal error page while still completing the request
            this.serverStatusService.checkAndUpdateServerStatus(request, error)
              .subscribe((isAvailable: boolean) => {
                if (!isAvailable) {
                  this.serverStatusService.navigateToInternalServerErrorPage();
              }
              });
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
    protected serverStatusService: ServerStatusService,
  ) {
  }

}
