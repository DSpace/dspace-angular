import { Inject } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { Observable } from "rxjs";
import { DSpaceRESTV2Response } from "../dspace-rest-v2/dspace-rest-v2-response.model";
import { DSpaceRESTv2Service } from "../dspace-rest-v2/dspace-rest-v2.service";
import { ObjectCacheService } from "../cache/object-cache.service";
import { CacheableObject } from "../cache/object-cache.reducer";
import { Serializer } from "../serializer";
import {
  RequestCacheActionTypes, RequestCacheFindAllAction, RequestCacheSuccessAction,
  RequestCacheErrorAction, RequestCacheFindByIDAction
} from "../cache/request-cache.actions";
import { DataService } from "./data.service";
import { hasNoValue } from "../../shared/empty.util";

import { GlobalConfig } from '../../../config';

export abstract class DataEffects<T extends CacheableObject> {
  protected abstract getFindAllEndpoint(action: RequestCacheFindAllAction): string;
  protected abstract getFindByIdEndpoint(action: RequestCacheFindByIDAction): string;
  protected abstract getSerializer(): Serializer<T>;

  constructor(
    private config: GlobalConfig,
    private actions$: Actions,
    private restApi: DSpaceRESTv2Service,
    private objectCache: ObjectCacheService,
    private dataService: DataService<T>
  ) { }

  // TODO, results of a findall aren't retrieved from cache yet
  protected findAll = this.actions$
    .ofType(RequestCacheActionTypes.FIND_ALL)
    .filter((action: RequestCacheFindAllAction) => action.payload.service === this.dataService.serviceName)
    .flatMap((action: RequestCacheFindAllAction) => {
      //TODO scope, pagination, sorting -> when we know how that works in rest
      return this.restApi.get(this.getFindAllEndpoint(action))
        .map((data: DSpaceRESTV2Response) => this.getSerializer().deserializeArray(data))
        .do((ts: T[]) => {
          ts.forEach((t) => {
            if (hasNoValue(t) || hasNoValue(t.uuid)) {
              throw new Error('The server returned an invalid object');
            }
            this.objectCache.add(t, this.config.cache.msToLive);
          });
        })
        .map((ts: Array<T>) => ts.map(t => t.uuid))
        .map((ids: Array<string>) => new RequestCacheSuccessAction(action.payload.key, ids, new Date().getTime(), this.config.cache.msToLive))
        .catch((error: Error) => Observable.of(new RequestCacheErrorAction(action.payload.key, error.message)));
    });

  protected findById = this.actions$
    .ofType(RequestCacheActionTypes.FIND_BY_ID)
    .filter((action: RequestCacheFindAllAction) => action.payload.service === this.dataService.serviceName)
    .flatMap((action: RequestCacheFindByIDAction) => {
      return this.restApi.get(this.getFindByIdEndpoint(action))
        .map((data: DSpaceRESTV2Response) => this.getSerializer().deserialize(data))
        .do((t: T) => {
          if (hasNoValue(t) || hasNoValue(t.uuid)) {
            throw new Error('The server returned an invalid object');
          }
          this.objectCache.add(t, this.config.cache.msToLive);
        })
        .map((t: T) => new RequestCacheSuccessAction(action.payload.key, [t.uuid], new Date().getTime(), this.config.cache.msToLive))
        .catch((error: Error) => Observable.of(new RequestCacheErrorAction(action.payload.key, error.message)));
    });

}
