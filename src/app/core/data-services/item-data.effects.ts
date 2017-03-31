import { Inject, Injectable } from "@angular/core";
import { DataEffects } from "./data.effects";
import { Serializer } from "../serializer";
import { Item } from "../shared/item.model";
import { DSpaceRESTv2Serializer } from "../dspace-rest-v2/dspace-rest-v2.serializer";
import { ObjectCacheService } from "../cache/object-cache.service";
import { DSpaceRESTv2Service } from "../dspace-rest-v2/dspace-rest-v2.service";
import { Actions, Effect } from "@ngrx/effects";
import { RequestCacheFindAllAction, RequestCacheFindByIDAction } from "../cache/request-cache.actions";
import { ItemDataService } from "./item-data.service";

import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';

@Injectable()
export class ItemDataEffects extends DataEffects<Item> {
  constructor(
    @Inject(GLOBAL_CONFIG) EnvConfig: GlobalConfig,
    actions$: Actions,
    restApi: DSpaceRESTv2Service,
    cache: ObjectCacheService,
    dataService: ItemDataService
  ) {
    super(EnvConfig, actions$, restApi, cache, dataService);
  }

  protected getFindAllEndpoint(action: RequestCacheFindAllAction): string {
    return '/items';
  }

  protected getFindByIdEndpoint(action: RequestCacheFindByIDAction): string {
    return `/items/${action.payload.resourceID}`;
  }

  protected getSerializer(): Serializer<Item> {
    return new DSpaceRESTv2Serializer(Item);
  }

  @Effect() findAll$ = this.findAll;

  @Effect() findById$ = this.findById;
}
