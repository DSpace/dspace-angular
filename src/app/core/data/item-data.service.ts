import { Injectable } from "@angular/core";
import { DataService } from "./data.service";
import { Item } from "../shared/item.model";
import { ObjectCacheService } from "../cache/object-cache.service";
import { ResponseCacheService } from "../cache/response-cache.service";
import { Store } from "@ngrx/store";
import { CoreState } from "../core.reducers";
import { NormalizedItem } from "../cache/models/normalized-item.model";
import { RequestService } from "./request.service";
import { RemoteDataBuildService } from "../cache/builders/remote-data-build.service";

@Injectable()
export class ItemDataService extends DataService<NormalizedItem, Item> {
  protected endpoint = '/items';

  constructor(
    protected objectCache: ObjectCacheService,
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>
) {
    super(NormalizedItem);
  }
}
