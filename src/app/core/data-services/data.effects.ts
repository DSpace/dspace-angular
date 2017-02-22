import { Actions, Effect } from "@ngrx/effects";
import { Observable } from "rxjs";
import { DSpaceRESTV2Response } from "../dspace-rest-v2/dspace-rest-v2-response.model";
import { DSpaceRESTv2Service } from "../dspace-rest-v2/dspace-rest-v2.service";
import { ObjectCacheService } from "../cache/object-cache.service";
import { GlobalConfig } from "../../../config";
import { CacheableObject } from "../cache/object-cache.reducer";
import { Serializer } from "../serializer";
import {
  RequestCacheActionTypes, FindAllRequestCacheAction, RequestCacheSuccessAction,
  RequestCacheErrorAction, FindByIDRequestCacheAction
} from "../cache/request-cache.actions";
import { DataService } from "./data.service";

export abstract class DataEffects<T extends CacheableObject> {
  protected abstract getFindAllEndpoint(action: FindAllRequestCacheAction): string;
  protected abstract getFindByIdEndpoint(action: FindByIDRequestCacheAction): string;
  protected abstract getSerializer(): Serializer<T>;

  constructor(
    private actions$: Actions,
    private restApi: DSpaceRESTv2Service,
    private objectCache: ObjectCacheService,
    private dataService: DataService<T>
  ) {}

  // TODO, results of a findall aren't retrieved from cache for now,
  // because currently the cache is more of an object store. We need to move
  // more towards memoization for things like this.
  protected findAll = this.actions$
    .ofType(RequestCacheActionTypes.FIND_ALL_REQUEST)
    .filter((action: FindAllRequestCacheAction) => action.payload.service === this.dataService.name)
    .switchMap((action: FindAllRequestCacheAction) => {
      //TODO scope, pagination, sorting -> when we know how that works in rest
      return this.restApi.get(this.getFindAllEndpoint(action))
        .map((data: DSpaceRESTV2Response) => this.getSerializer().deserializeArray(data))
        .do((ts: T[]) => {
          ts.forEach((t) => {
            this.objectCache.add(t, GlobalConfig.cache.msToLive);
          });
        })
        .map((ts: Array<T>) => ts.map(t => t.uuid))
        .map((ids: Array<string>) => new RequestCacheSuccessAction(action.payload.key, ids, GlobalConfig.cache.msToLive))
        .catch((errorMsg: string) => Observable.of(new RequestCacheErrorAction(action.payload.key, errorMsg)));
    });

  protected findById = this.actions$
    .ofType(RequestCacheActionTypes.FIND_BY_ID_REQUEST)
    .filter((action: FindAllRequestCacheAction) => action.payload.service === this.dataService.name)
    .switchMap((action: FindByIDRequestCacheAction) => {
      return this.restApi.get(this.getFindByIdEndpoint(action))
        .map((data: DSpaceRESTV2Response) => this.getSerializer().deserialize(data))
        .do((t: T) => {
          this.objectCache.add(t, GlobalConfig.cache.msToLive);
        })
        .map((t: T) => new RequestCacheSuccessAction(action.payload.key, [t.uuid], GlobalConfig.cache.msToLive))
        .catch((errorMsg: string) => Observable.of(new RequestCacheErrorAction(action.payload.key, errorMsg)));
    });

}
