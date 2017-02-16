import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { Item } from "../../shared/item.model";
import { Observable } from "rxjs";
import {
  ItemFindMultipleActionTypes,
  ItemFindMultipleSuccessAction,
  ItemFindMultipleErrorAction
} from "./item-find-multiple.actions";
import {
  ItemFindSingleActionTypes,
  ItemFindByIdSuccessAction,
  ItemFindByIdErrorAction
} from "./item-find-single.actions";
import { DSpaceRESTV2Response } from "../../dspace-rest-v2/dspace-rest-v2-response.model";
import { DSpaceRESTv2Serializer } from "../../dspace-rest-v2/dspace-rest-v2.serializer";
import { DSpaceRESTv2Service } from "../../dspace-rest-v2/dspace-rest-v2.service";
import { CacheService } from "../cache/cache.service";
import { GlobalConfig } from "../../../../config";


@Injectable()
export class ItemDataEffects {
  constructor(
    private actions$: Actions,
    private restApi: DSpaceRESTv2Service,
    private cache: CacheService
  ) {}

  // TODO, results of a findall aren't retrieved from cache for now,
  // because currently the cache is more of an object store. We need to move
  // more towards memoization for things like this.
  @Effect() findAll$ = this.actions$
    .ofType(ItemFindMultipleActionTypes.FIND_MULTI_REQUEST)
    .switchMap(() => {
      return this.restApi.get('/items')
        .map((data: DSpaceRESTV2Response) => new DSpaceRESTv2Serializer(Item).deserializeArray(data))
        .do((items: Item[]) => {
          items.forEach((item) => {
            this.cache.add(item, GlobalConfig.cache.msToLive);
          });
        })
        .map((items: Array<Item>) => items.map(item => item.id))
        .map((ids: Array<string>) => new ItemFindMultipleSuccessAction(ids))
        .catch((errorMsg: string) => Observable.of(new ItemFindMultipleErrorAction(errorMsg)));
    });

  @Effect() findById$ = this.actions$
    .ofType(ItemFindSingleActionTypes.FIND_BY_ID_REQUEST)
    .switchMap(action => {
      if (this.cache.has(action.payload)) {
        return this.cache.get<Item>(action.payload)
          .map(item => new ItemFindByIdSuccessAction(item.id));
      }
      else {
        return this.restApi.get(`/items/${action.payload}`)
          .map((data: DSpaceRESTV2Response) => new DSpaceRESTv2Serializer(Item).deserialize(data))
          .do((item: Item) => {
            this.cache.add(item, GlobalConfig.cache.msToLive);
          })
          .map((item: Item) => new ItemFindByIdSuccessAction(item.id))
          .catch((errorMsg: string) => Observable.of(new ItemFindByIdErrorAction(errorMsg)));
      }
    });

}
