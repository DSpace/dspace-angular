import { Injectable, Inject } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { DSpaceRESTv2Service } from "../dspace-rest-v2/dspace-rest-v2.service";
import { ObjectCacheService } from "../cache/object-cache.service";
import { DSpaceRESTV2Response } from "../dspace-rest-v2/dspace-rest-v2-response.model";
import { DSpaceRESTv2Serializer } from "../dspace-rest-v2/dspace-rest-v2.serializer";
import { CacheableObject } from "../cache/object-cache.reducer";
import { Observable } from "rxjs";
import { Response, SuccessResponse, ErrorResponse } from "../cache/response-cache.models";
import { hasNoValue } from "../../shared/empty.util";
import { GlobalConfig, GLOBAL_CONFIG } from "../../../config";
import { RequestState, RequestEntry } from "./request.reducer";
import {
  RequestActionTypes, RequestExecuteAction,
  RequestCompleteAction
} from "./request.actions";
import { ResponseCacheService } from "../cache/response-cache.service";
import { RequestService } from "./request.service";

@Injectable()
export class RequestEffects {

  constructor(
    @Inject(GLOBAL_CONFIG) private EnvConfig: GlobalConfig,
    private actions$: Actions,
    private restApi: DSpaceRESTv2Service,
    private objectCache: ObjectCacheService,
    private responseCache: ResponseCacheService,
    protected requestService: RequestService,
    private store: Store<RequestState>
  ) { }

  @Effect() execute = this.actions$
    .ofType(RequestActionTypes.EXECUTE)
    .flatMap((action: RequestExecuteAction) => {
      return this.requestService.get(action.payload)
        .take(1);
    })
    .flatMap((entry: RequestEntry) => {
      const [ifArray, ifNotArray] = this.restApi.get(entry.request.href)
        .share() // share ensures restApi.get() doesn't get called twice when the partitions are used below
        .partition((data: DSpaceRESTV2Response) => Array.isArray(data._embedded));

      return Observable.merge(

        ifArray.map((data: DSpaceRESTV2Response) => {
          return new DSpaceRESTv2Serializer(entry.request.resourceType).deserializeArray(data);
        }).do((cos: CacheableObject[]) => cos.forEach((t) => this.addToObjectCache(t)))
          .map((cos: Array<CacheableObject>): Array<string> => cos.map(t => t.uuid)),

        ifNotArray.map((data: DSpaceRESTV2Response) => {
          return new DSpaceRESTv2Serializer(entry.request.resourceType).deserialize(data);
        }).do((co: CacheableObject) => this.addToObjectCache(co))
          .map((co: CacheableObject): Array<string> => [co.uuid])

      ).map((ids: Array<string>) => new SuccessResponse(ids))
        .do((response: Response) => this.responseCache.add(entry.request.href, response, this.EnvConfig.cache.msToLive))
        .map((response: Response) => new RequestCompleteAction(entry.request.href))
        .catch((error: Error) => Observable.of(new ErrorResponse(error.message))
          .do((response: Response) => this.responseCache.add(entry.request.href, response, this.EnvConfig.cache.msToLive))
          .map((response: Response) => new RequestCompleteAction(entry.request.href)));
    });

  protected addToObjectCache(co: CacheableObject): void {
    if (hasNoValue(co) || hasNoValue(co.uuid)) {
      throw new Error('The server returned an invalid object');
    }
    this.objectCache.add(co, this.EnvConfig.cache.msToLive);
  }
}
