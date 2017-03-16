import { Injectable, OpaqueToken } from "@angular/core";
import { DataService } from "./data.service";
import { Collection } from "../shared/collection.model";
import { ObjectCacheService } from "../cache/object-cache.service";
import { RequestCacheService } from "../cache/request-cache.service";

@Injectable()
export class CollectionDataService extends DataService<Collection> {
  serviceName = new OpaqueToken('CollectionDataService');

  constructor(
    protected objectCache: ObjectCacheService,
    protected requestCache: RequestCacheService,
  ) {
    super(Collection);
  }

}
