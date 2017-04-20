import { Item } from "../../shared/item.model";
import { ObjectCacheService } from "../object-cache.service";
import { ResponseCacheService } from "../response-cache.service";
import { RequestService } from "../../data/request.service";
import { Store } from "@ngrx/store";
import { CoreState } from "../../core.reducers";
import { NormalizedItem } from "./normalized-item.model";
import { ListRemoteDataBuilder, SingleRemoteDataBuilder } from "./remote-data-builder";

export class ItemBuilder {

  constructor(
    protected objectCache: ObjectCacheService,
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected store: Store<CoreState>,
    protected href: string,
    protected nc: NormalizedItem
  ) {
  }

  build(): Item {
    //TODO
    return Object.assign(new Item(), this.nc);
  }
}

export class ItemRDBuilder extends SingleRemoteDataBuilder<Item, NormalizedItem> {

  constructor(
    objectCache: ObjectCacheService,
    responseCache: ResponseCacheService,
    requestService: RequestService,
    store: Store<CoreState>,
    href: string
  ) {
    super(objectCache, responseCache, requestService, store, href, NormalizedItem);
  }

  protected normalizedToDomain(normalized: NormalizedItem): Item {
    return new ItemBuilder(this.objectCache, this.responseCache, this.requestService, this.store, this.href, normalized).build();
  }

}

export class ItemListRDBuilder extends ListRemoteDataBuilder<Item, NormalizedItem> {
  constructor(
    objectCache: ObjectCacheService,
    responseCache: ResponseCacheService,
    requestService: RequestService,
    store: Store<CoreState>,
    href: string
  ) {
    super(objectCache, responseCache, requestService, store, href, NormalizedItem);
  }

  protected normalizedToDomain(normalized: NormalizedItem): Item {
    return new ItemBuilder(this.objectCache, this.responseCache, this.requestService, this.store, this.href, normalized).build();
  }

}
