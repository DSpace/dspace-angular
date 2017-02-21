import { Injectable } from "@angular/core";
import { DataEffects } from "./data.effects";
import { Serializer } from "../serializer";
import { Item } from "../shared/item.model";
import { DSpaceRESTv2Serializer } from "../dspace-rest-v2/dspace-rest-v2.serializer";
import { CacheService } from "./cache/cache.service";
import { DSpaceRESTv2Service } from "../dspace-rest-v2/dspace-rest-v2.service";
import { Actions, Effect } from "@ngrx/effects";
import { DataFindAllRequestAction, DataFindByIDRequestAction } from "./data.actions";
import { ItemDataService } from "./item-data.service";

@Injectable()
export class ItemDataEffects extends DataEffects<Item> {
  constructor(
    actions$: Actions,
    restApi: DSpaceRESTv2Service,
    cache: CacheService,
    dataService: ItemDataService
  ) {
    super(actions$, restApi, cache, dataService);
  }

  protected getFindAllEndpoint(action: DataFindAllRequestAction): string {
    return '/items';
  }

  protected getFindByIdEndpoint(action: DataFindByIDRequestAction): string {
    return `/items/${action.payload.resourceID}`;
  }

  protected getSerializer(): Serializer<Item> {
    return new DSpaceRESTv2Serializer(Item);
  }

  @Effect() findAll$ = this.findAll;

  @Effect() findById$ = this.findById;
}
