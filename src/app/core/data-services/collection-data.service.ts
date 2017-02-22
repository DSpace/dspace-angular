import { Injectable, OpaqueToken } from "@angular/core";
import { Store } from "@ngrx/store";
import { DataService } from "./data.service";
import { Collection } from "../shared/collection.model";
import { ObjectCacheService } from "../cache/object-cache.service";
import { RequestCacheState } from "../cache/request-cache.reducer";

@Injectable()
export class CollectionDataService extends DataService<Collection> {
  name = new OpaqueToken('CollectionDataService');

  constructor(
    store: Store<RequestCacheState>,
    cache: ObjectCacheService
  ) {
    super(store, cache);
  }

}
