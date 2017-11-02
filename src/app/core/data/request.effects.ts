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
import { RequestError } from './request.models';
import { RequestEntry } from './request.reducer';
import { RequestService } from './request.service';
import { UniversalService } from '../../universal.service';

@Injectable()
export class RequestEffects {

  @Effect() execute = this.actions$
    .ofType(RequestActionTypes.EXECUTE)
    .filter(() => !this.universalService.isReplaying)
    .flatMap((action: RequestExecuteAction) => {
      return this.requestService.get(action.payload)
        .take(1);
    })
    .flatMap((entry: RequestEntry) => {
      return this.restApi.get(entry.request.href)
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
    protected requestService: RequestService,
    private universalService: UniversalService
  ) { }

}
/* tslint:enable:max-classes-per-file */
