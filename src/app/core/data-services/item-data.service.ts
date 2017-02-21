import { Injectable, OpaqueToken } from "@angular/core";
import { Store } from "@ngrx/store";
import { DataService } from "./data.service";
import { Item } from "../shared/item.model";
import { CacheService } from "./cache/cache.service";
import { DataState } from "./data.reducer";

@Injectable()
export class ItemDataService extends DataService<Item> {
  name = new OpaqueToken('ItemDataService');

  constructor(
    store: Store<DataState>,
    cache: CacheService
  ) {
    super(store, cache);
  }

}
