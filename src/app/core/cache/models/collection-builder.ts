import { Collection } from "../../shared/collection.model";
import { hasValue } from "../../../shared/empty.util";
import { Item } from "../../shared/item.model";
import { RequestConfigureAction, RequestExecuteAction } from "../../data/request.actions";
import { ObjectCacheService } from "../object-cache.service";
import { ResponseCacheService } from "../response-cache.service";
import { RequestService } from "../../data/request.service";
import { Store } from "@ngrx/store";
import { CoreState } from "../../core.reducers";
import { NormalizedCollection } from "./normalized-collection.model";
import { Request } from "../../data/request.models";
import { ListRemoteDataBuilder, SingleRemoteDataBuilder } from "./remote-data-builder";
import { ItemRDBuilder } from "./item-builder";

export class CollectionBuilder {

  constructor(
    protected objectCache: ObjectCacheService,
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected store: Store<CoreState>,
    protected href: string,
    protected nc: NormalizedCollection
  ) {
  }

  build(): Collection {
    let links: any = {};

    if (hasValue(this.nc.items)) {
      this.nc.items.forEach((href: string) => {
        const isCached = this.objectCache.hasBySelfLink(href);
        const isPending = this.requestService.isPending(href);

        console.log('href', href, 'isCached', isCached, "isPending", isPending);

        if (!(isCached || isPending)) {
          const request = new Request(href, Item);
          this.store.dispatch(new RequestConfigureAction(request));
          this.store.dispatch(new RequestExecuteAction(href));
        }
      });

      links.items = this.nc.items.map((href: string) => {
        return new ItemRDBuilder(
          this.objectCache,
          this.responseCache,
          this.requestService,
          this.store,
          href
        ).build();
      });
    }

    return Object.assign(new Collection(), this.nc, links);
  }
}

export class CollectionRDBuilder extends SingleRemoteDataBuilder<Collection, NormalizedCollection> {

  constructor(
    objectCache: ObjectCacheService,
    responseCache: ResponseCacheService,
    requestService: RequestService,
    store: Store<CoreState>,
    href: string
  ) {
    super(objectCache, responseCache, requestService, store, href, NormalizedCollection);
  }

  protected normalizedToDomain(normalized: NormalizedCollection): Collection {
    return new CollectionBuilder(this.objectCache, this.responseCache, this.requestService, this.store, this.href, normalized).build();
  }

}

export class CollectionListRDBuilder extends ListRemoteDataBuilder<Collection, NormalizedCollection> {

  constructor(
    objectCache: ObjectCacheService,
    responseCache: ResponseCacheService,
    requestService: RequestService,
    store: Store<CoreState>,
    href: string
  ) {
    super(objectCache, responseCache, requestService, store, href, NormalizedCollection);
  }

  protected normalizedToDomain(normalized: NormalizedCollection): Collection {
    return new CollectionBuilder(this.objectCache, this.responseCache, this.requestService, this.store, this.href, normalized).build();
  }

}
