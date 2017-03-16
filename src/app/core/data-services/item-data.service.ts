import { Injectable, OpaqueToken } from "@angular/core";
import { DataService } from "./data.service";
import { Item } from "../shared/item.model";
import { ObjectCacheService } from "../cache/object-cache.service";
import { RequestCacheService } from "../cache/request-cache.service";

@Injectable()
export class ItemDataService extends DataService<Item> {
  serviceName = new OpaqueToken('ItemDataService');

  constructor(
    protected objectCache: ObjectCacheService,
    protected requestCache: RequestCacheService,
  ) {
    super(Item);
  }

}
