import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CollectionDataState } from "./collection-data.reducer";
import { Store } from "@ngrx/store";
import { Collection } from "../../shared/collection.model";
import { CollectionFindMultipleRequestAction } from "./collection-find-multiple.actions";
import { CollectionFindByIdRequestAction } from "./collection-find-single.actions";
import { CacheService } from "../cache/cache.service";
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class CollectionDataService {
  constructor(
    private store: Store<CollectionDataState>,
    private cache: CacheService
  ) { }

  findAll(scopeID?: string): Observable<Collection[]> {
    this.store.dispatch(new CollectionFindMultipleRequestAction(scopeID));
    //get an observable of the IDs from the collectionData store
    return this.store.select<Array<string>>('core', 'collectionData', 'findMultiple', 'collectionsIDs')
      .flatMap((collectionIds: Array<string>) => {
        // use those IDs to fetch the actual collection objects from the cache
        return this.cache.getList<Collection>(collectionIds);
      });
  }

  findById(id: string): Observable<Collection> {
    this.store.dispatch(new CollectionFindByIdRequestAction(id));
    return this.cache.get<Collection>(id);
  }

}
