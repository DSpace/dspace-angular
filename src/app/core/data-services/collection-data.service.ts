import { Injectable, OpaqueToken } from "@angular/core";
import { Store } from "@ngrx/store";
import { DataService } from "./data.service";
import { Collection } from "../shared/collection.model";
import { CacheService } from "./cache/cache.service";
import { DataState } from "./data.reducer";

@Injectable()
export class CollectionDataService extends DataService<Collection> {
  name = new OpaqueToken('CollectionDataService');

  constructor(
    store: Store<DataState>,
    cache: CacheService
  ) {
    super(store, cache);
  }

}
