import { Injectable, OpaqueToken } from "@angular/core";
import { Store } from "@ngrx/store";
import { DataService } from "./data.service";
import { Item } from "../shared/item.model";
import { ObjectCacheService } from "../cache/object-cache.service";
import { RequestCacheState } from "../cache/request-cache.reducer";

@Injectable()
export class ItemDataService extends DataService<Item> {
  name = new OpaqueToken('ItemDataService');

  constructor(
    store: Store<RequestCacheState>,
    cache: ObjectCacheService
  ) {
    super(store, cache);
  }

}
