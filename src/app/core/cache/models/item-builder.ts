import { Item } from "../../shared/item.model";
import { ObjectCacheService } from "../object-cache.service";
import { ResponseCacheService } from "../response-cache.service";
import { RequestService } from "../../data/request.service";
import { Store } from "@ngrx/store";
import { CoreState } from "../../core.reducers";
import { NormalizedItem } from "./normalized-item.model";
import { ListRemoteDataBuilder, SingleRemoteDataBuilder } from "./remote-data-builder";
import { Request } from "../../data/request.models";
import { hasValue } from "../../../shared/empty.util";
import { RequestConfigureAction, RequestExecuteAction } from "../../data/request.actions";
import { BundleRDBuilder } from "./bundle-builder";
import { NormalizedBundle } from "./normalized-bundle.model";

export class ItemBuilder {

  constructor(
    protected objectCache: ObjectCacheService,
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected store: Store<CoreState>,
    protected href: string,
    protected normalized: NormalizedItem
  ) {
  }

  build(): Item {
    let links: any = {};

    if (hasValue(this.normalized.bundles)) {
      this.normalized.bundles.forEach((href: string) => {
        const isCached = this.objectCache.hasBySelfLink(href);
        const isPending = this.requestService.isPending(href);

        if (!(isCached || isPending)) {
          const request = new Request(href, NormalizedBundle);
          this.store.dispatch(new RequestConfigureAction(request));
          this.store.dispatch(new RequestExecuteAction(href));
        }
      });

      links.bundles = this.normalized.bundles.map((href: string) => {
        return new BundleRDBuilder(
          this.objectCache,
          this.responseCache,
          this.requestService,
          this.store,
          href
        ).build();
      });
    }
    return Object.assign(new Item(), this.normalized, links);
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
