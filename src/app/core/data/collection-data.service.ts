import { Injectable } from "@angular/core";
import { DataService } from "./data.service";
import { Collection } from "../shared/collection.model";
import { ObjectCacheService } from "../cache/object-cache.service";
import { ResponseCacheService } from "../cache/response-cache.service";
import { RemoteData } from "./remote-data";
import { ItemDataService } from "./item-data.service";
import { Store } from "@ngrx/store";
import { RequestState } from "./request.reducer";

@Injectable()
export class CollectionDataService extends DataService<Collection> {
  protected endpoint = '/collections';

  constructor(
    protected objectCache: ObjectCacheService,
    protected responseCache: ResponseCacheService,
    protected store: Store<RequestState>,
    protected ids: ItemDataService
  ) {
    super(Collection);
  }

  // findAll(scopeID?: string): RemoteData<Array<Collection>> {
  //   let remoteData = super.findAll(scopeID);
  //   remoteData.payload = remoteData.payload.map(collections => {
  //     return collections.map(collection => {
  //       collection.items = collection.itemLinks.map(item => {
  //         return this.ids.findById(item.self);
  //       });
  //       return collection
  //     });
  //   });
  //   return remoteData;
  // }
}
