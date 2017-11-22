import { Inject, Injectable, Injector } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';

import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { ErrorResponse, RestResponse } from '../cache/response-cache.models';
import { ResponseCacheService } from '../cache/response-cache.service';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';

import { DSpaceRESTv2Service } from '../dspace-rest-v2/dspace-rest-v2.service';
import { RequestActionTypes, RequestCompleteAction, RequestExecuteAction } from './request.actions';
import { RequestError, RestRequest, RequestType } from './request.models';
import { RequestEntry } from './request.reducer';
import { RequestService } from './request.service';
import { NormalizedBitstream } from '../cache/models/normalized-bitstream.model';

@Injectable()
export class RequestEffects {

  @Effect() execute = this.actions$
    .ofType(RequestActionTypes.EXECUTE)
    .flatMap((action: RequestExecuteAction) => {
      return this.requestService.get(action.payload.href)
        .take(1);
    })
    .flatMap((entry: RequestEntry) => {
      return this.makeHttpRequest(entry.request)
        .map((data: DSpaceRESTV2Response) =>
          this.injector.get(entry.request.getResponseParser()).parse(entry.request, data))
        .do((response: RestResponse) => this.responseCache.add(entry.request.href, response, this.EnvConfig.cache.msToLive))
        .map((response: RestResponse) => new RequestCompleteAction(entry.request.href))
        .catch((error: RequestError) => Observable.of(new ErrorResponse(error))
          .do((response: RestResponse) => this.responseCache.add(entry.request.href, response, this.EnvConfig.cache.msToLive))
          .map((response: RestResponse) => new RequestCompleteAction(entry.request.href)));
    });

  constructor(
    @Inject(GLOBAL_CONFIG) private EnvConfig: GlobalConfig,
    private actions$: Actions,
    private restApi: DSpaceRESTv2Service,
    private injector: Injector,
    private responseCache: ResponseCacheService,
    protected requestService: RequestService
  ) { }

  private makeHttpRequest(request: RestRequest): Observable<DSpaceRESTV2Response> {
    switch (request.requestType) {
      case RequestType.GET: {
        return this.restApi.get(request.href)
      }
      case RequestType.POST: {
        return this.restApi.post(request.href, request.body)
      }
      case RequestType.PATCH: {
        return this.restApi.patch(request.href, request.body)
      }
    }
  }

}
/* tslint:enable:max-classes-per-file */
