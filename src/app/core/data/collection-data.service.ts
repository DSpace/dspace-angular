import { Injectable } from "@angular/core";
import { DataService } from "./data.service";
import { Collection } from "../shared/collection.model";
import { ObjectCacheService } from "../cache/object-cache.service";
import { ResponseCacheService } from "../cache/response-cache.service";
import { Store } from "@ngrx/store";
import { NormalizedCollection } from "../cache/models/normalized-collection.model";
import { CoreState } from "../core.reducers";
import { RequestService } from "./request.service";
import { CollectionListRDBuilder, CollectionRDBuilder } from "../cache/models/collection-builder";

@Injectable()
export class CollectionDataService extends DataService<Collection, NormalizedCollection> {
  protected endpoint = '/collections';

  constructor(
    protected objectCache: ObjectCacheService,
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected store: Store<CoreState>
  ) {
      super(NormalizedCollection);
  }

  protected getListDataBuilder(href: string): CollectionListRDBuilder {
    return new CollectionListRDBuilder (
      this.objectCache,
      this.responseCache,
      this.requestService,
      this.store,
      href,
    );
  }

  protected getSingleDataBuilder(href: string): CollectionRDBuilder {
    return new CollectionRDBuilder (
      this.objectCache,
      this.responseCache,
      this.requestService,
      this.store,
      href,
    );
  }

}
