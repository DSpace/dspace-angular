import { Actions, Effect } from "@ngrx/effects";
import { Observable } from "rxjs";
import { DSpaceRESTV2Response } from "../dspace-rest-v2/dspace-rest-v2-response.model";
import { DSpaceRESTv2Service } from "../dspace-rest-v2/dspace-rest-v2.service";
import { CacheService } from "./cache/cache.service";
import { GlobalConfig } from "../../../config";
import { CacheableObject } from "./cache/cache.reducer";
import { Serializer } from "../serializer";
import {
  DataActionTypes, DataFindAllRequestAction, DataSuccessAction,
  DataErrorAction, DataFindByIDRequestAction, DataAction
} from "./data.actions";
import { DataService } from "./data.service";

export abstract class DataEffects<T extends CacheableObject> {
  protected abstract getFindAllEndpoint(action: DataFindAllRequestAction): string;
  protected abstract getFindByIdEndpoint(action: DataFindByIDRequestAction): string;
  protected abstract getSerializer(): Serializer<T>;

  constructor(
    private actions$: Actions,
    private restApi: DSpaceRESTv2Service,
    private cache: CacheService,
    private dataService: DataService<T>
  ) {}

  // TODO, results of a findall aren't retrieved from cache for now,
  // because currently the cache is more of an object store. We need to move
  // more towards memoization for things like this.
  protected findAll = this.actions$
    .ofType(DataActionTypes.FIND_ALL_REQUEST)
    .filter((action: DataFindAllRequestAction) => action.payload.service === this.dataService.name)
    .switchMap((action: DataFindAllRequestAction) => {
      //TODO scope, pagination, sorting -> when we know how that works in rest
      return this.restApi.get(this.getFindAllEndpoint(action))
        .map((data: DSpaceRESTV2Response) => this.getSerializer().deserializeArray(data))
        .do((ts: T[]) => {
          ts.forEach((t) => {
            this.cache.add(t, GlobalConfig.cache.msToLive);
          });
        })
        .map((ts: Array<T>) => ts.map(t => t.uuid))
        .map((ids: Array<string>) => new DataSuccessAction(action.payload.key, ids))
        .catch((errorMsg: string) => Observable.of(new DataErrorAction(action.payload.key, errorMsg)));
    });

  protected findById = this.actions$
    .ofType(DataActionTypes.FIND_BY_ID_REQUEST)
    .filter((action: DataFindAllRequestAction) => action.payload.service === this.dataService.name)
    .switchMap((action: DataFindByIDRequestAction) => {
      return this.restApi.get(this.getFindByIdEndpoint(action))
        .map((data: DSpaceRESTV2Response) => this.getSerializer().deserialize(data))
        .do((t: T) => {
          this.cache.add(t, GlobalConfig.cache.msToLive);
        })
        .map((t: T) => new DataSuccessAction(action.payload.key, [t.uuid]))
        .catch((errorMsg: string) => Observable.of(new DataErrorAction(action.payload.key, errorMsg)));
    });

}
