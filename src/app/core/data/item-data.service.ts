import { Injectable } from "@angular/core";
import { DataService } from "./data.service";
import { Item } from "../shared/item.model";
import { ObjectCacheService } from "../cache/object-cache.service";
import { ResponseCacheService } from "../cache/response-cache.service";
import { Store } from "@ngrx/store";
import { RequestState } from "./request.reducer";

@Injectable()
export class ItemDataService extends DataService<Item> {
  protected endpoint = '/items';

  constructor(
    protected objectCache: ObjectCacheService,
    protected responseCache: ResponseCacheService,
    protected store: Store<RequestState>
) {
    super(Item);
  }

}
