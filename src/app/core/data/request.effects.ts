import { Inject, Injectable, Injector } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, flatMap, map, take, tap } from 'rxjs/operators';

import { RequestActionTypes, RequestCompleteAction, RequestExecuteAction } from './request.actions';
import { RequestError, RestRequest } from './request.models';
import { RequestEntry } from './request.reducer';
import { RequestService } from './request.service';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { isNotEmpty } from '../../shared/empty.util';
import { NormalizedObjectFactory } from '../cache/models/normalized-object-factory';
import { ErrorResponse, RestResponse } from '../cache/response-cache.models';
import { ResponseCacheService } from '../cache/response-cache.service';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { DSpaceRESTv2Service } from '../dspace-rest-v2/dspace-rest-v2.service';

export const addToResponseCacheAndCompleteAction = (request: RestRequest, responseCache: ResponseCacheService, envConfig: GlobalConfig) =>
  (source: Observable<ErrorResponse>): Observable<RequestCompleteAction> =>
    source.pipe(
      tap((response: RestResponse) => responseCache.add(request.href, response, envConfig.cache.msToLive)),
      map((response: RestResponse) => new RequestCompleteAction(request.uuid))
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
    map((entry: RequestEntry) => entry.request),
    flatMap((request: RestRequest) => {
      let body;
      if (isNotEmpty(request.body)) {
        const serializer = new DSpaceRESTv2Serializer(NormalizedObjectFactory.getConstructor(request.body.type));
        body = serializer.serialize(request.body);
      }
      return this.restApi.request(request.method, request.href, body, request.options).pipe(
        map((data: DSpaceRESTV2Response) => this.injector.get(request.getResponseParser()).parse(request, data)),
        addToResponseCacheAndCompleteAction(request, this.responseCache, this.EnvConfig),
        catchError((error: RequestError) => observableOf(new ErrorResponse(error)).pipe(
          addToResponseCacheAndCompleteAction(request, this.responseCache, this.EnvConfig)
        ))
      );
    })
  );

  constructor(
    @Inject(GLOBAL_CONFIG) private EnvConfig: GlobalConfig,
    private actions$: Actions,
    private restApi: DSpaceRESTv2Service,
    private injector: Injector,
    private responseCache: ResponseCacheService,
    protected requestService: RequestService
  ) { }

}
/* tslint:enable:max-classes-per-file */
