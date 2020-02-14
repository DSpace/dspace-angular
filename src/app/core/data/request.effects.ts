import { Inject, Injectable, Injector } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, filter, flatMap, map, take } from 'rxjs/operators';

import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { StoreActionTypes } from '../../store.actions';
import { getClassForType } from '../cache/builders/build-decorators';
import { ErrorResponse, RestResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';

import { DSpaceRESTv2Service } from '../dspace-rest-v2/dspace-rest-v2.service';
import { DSpaceSerializer } from '../dspace-rest-v2/dspace.serializer';
import {
  RequestActionTypes,
  RequestCompleteAction,
  RequestExecuteAction,
  ResetResponseTimestampsAction
} from './request.actions';
import { RequestError, RestRequest } from './request.models';
import { RequestEntry } from './request.reducer';
import { RequestService } from './request.service';

export const addToResponseCacheAndCompleteAction = (request: RestRequest, envConfig: GlobalConfig) =>
  (source: Observable<RestResponse>): Observable<RequestCompleteAction> =>
    source.pipe(
      map((response: RestResponse) => {
        return new RequestCompleteAction(request.uuid, response)
      })
    );

@Injectable()
export class RequestEffects {

  @Effect() execute = this.actions$.pipe(
    ofType(RequestActionTypes.EXECUTE),
    flatMap((action: RequestExecuteAction) => {
      return this.requestService.getByUUID(action.payload).pipe(
        take(1)
      );
    }),
    filter((entry: RequestEntry) => hasValue(entry)),
    map((entry: RequestEntry) => entry.request),
    flatMap((request: RestRequest) => {
      let body;
      if (isNotEmpty(request.body)) {
        const serializer = new DSpaceSerializer(getClassForType(request.body.type));
        body = serializer.serialize(request.body);
      }
      return this.restApi.request(request.method, request.href, body, request.options).pipe(
        map((data: DSpaceRESTV2Response) => this.injector.get(request.getResponseParser()).parse(request, data)),
        addToResponseCacheAndCompleteAction(request, this.EnvConfig),
        catchError((error: RequestError) => observableOf(new ErrorResponse(error)).pipe(
          addToResponseCacheAndCompleteAction(request, this.EnvConfig)
        ))
      );
    })
  );

  /**
   * When the store is rehydrated in the browser, set all cache
   * timestamps to 'now', because the time zone of the server can
   * differ from the client.
   *
   * This assumes that the server cached everything a negligible
   * time ago, and will likely need to be revisited later
   */
  @Effect() fixTimestampsOnRehydrate = this.actions$
    .pipe(ofType(StoreActionTypes.REHYDRATE),
      map(() => new ResetResponseTimestampsAction(new Date().getTime()))
    );

  constructor(
    @Inject(GLOBAL_CONFIG) private EnvConfig: GlobalConfig,
    private actions$: Actions,
    private restApi: DSpaceRESTv2Service,
    private injector: Injector,
    protected requestService: RequestService
  ) { }

}
/* tslint:enable:max-classes-per-file */
