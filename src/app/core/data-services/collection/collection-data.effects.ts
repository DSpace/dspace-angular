import { Injectable } from "@angular/core";
import { Actions, Effect, toPayload } from "@ngrx/effects";
import { Collection } from "../../shared/collection.model";
import { Observable } from "rxjs";
import {
  CollectionFindMultipleActionTypes,
  CollectionFindMultipleSuccessAction,
  CollectionFindMultipleErrorAction
} from "./collection-find-multiple.actions";
import {
  CollectionFindSingleActionTypes,
  CollectionFindByIdSuccessAction,
  CollectionFindByIdErrorAction
} from "./collection-find-single.actions";
import { DSpaceRESTV2Response } from "../../dspace-rest-v2/dspace-rest-v2-response.model";
import { DSpaceRESTv2Serializer } from "../../dspace-rest-v2/dspace-rest-v2.serializer";
import { DSpaceRESTv2Service } from "../../dspace-rest-v2/dspace-rest-v2.service";
import { CacheService } from "../cache/cache.service";
import { GlobalConfig } from "../../../../config";


@Injectable()
export class CollectionDataEffects {
  constructor(
    private actions$: Actions,
    private restApi: DSpaceRESTv2Service,
    private cache: CacheService
  ) {}

  // TODO, results of a findall aren't retrieved from cache for now,
  // because currently the cache is more of an object store. We need to move
  // more towards memoization for things like this.
  @Effect() findAll$ = this.actions$
    .ofType(CollectionFindMultipleActionTypes.FIND_MULTI_REQUEST)
    .switchMap(() => {
      return this.restApi.get('/collections')
        .map((data: DSpaceRESTV2Response) => new DSpaceRESTv2Serializer(Collection).deserializeArray(data))
        .do((collections: Collection[]) => {
          collections.forEach((collection) => {
            this.cache.add(collection, GlobalConfig.cache.msToLive);
          });
        })
        .map((collections: Array<Collection>) => collections.map(collection => collection.id))
        .map((ids: Array<string>) => new CollectionFindMultipleSuccessAction(ids))
        .catch((errorMsg: string) => Observable.of(new CollectionFindMultipleErrorAction(errorMsg)));
    });

  @Effect() findById$ = this.actions$
    .ofType(CollectionFindSingleActionTypes.FIND_BY_ID_REQUEST)
    .switchMap(action => {
      if (this.cache.has(action.payload)) {
        return this.cache.get<Collection>(action.payload)
          .map(collection => new CollectionFindByIdSuccessAction(collection.id));
      }
      else {
        return this.restApi.get(`/collections/${action.payload}`)
          .map((data: DSpaceRESTV2Response) => new DSpaceRESTv2Serializer(Collection).deserialize(data))
          .do((collection: Collection) => {
            this.cache.add(collection, GlobalConfig.cache.msToLive);
          })
          .map((collection: Collection) => new CollectionFindByIdSuccessAction(collection.id))
          .catch((errorMsg: string) => Observable.of(new CollectionFindByIdErrorAction(errorMsg)));
      }
    });

}
