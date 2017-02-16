import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ItemDataState } from "./item-data.reducer";
import { Store } from "@ngrx/store";
import { Item } from "../../shared/item.model";
import { ItemFindMultipleRequestAction } from "./item-find-multiple.actions";
import { ItemFindByIdRequestAction } from "./item-find-single.actions";
import { CacheService } from "../cache/cache.service";
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class ItemDataService {
  constructor(
    private store: Store<ItemDataState>,
    private cache: CacheService
  ) { }

  findAll(scopeID?: string): Observable<Item[]> {
    this.store.dispatch(new ItemFindMultipleRequestAction(scopeID));
    //get an observable of the IDs from the itemData store
    return this.store.select<Array<string>>('core', 'itemData', 'findMultiple', 'itemsIDs')
      .flatMap((itemIds: Array<string>) => {
        // use those IDs to fetch the actual item objects from the cache
        return this.cache.getList<Item>(itemIds);
      });
  }

  findById(id: string): Observable<Item> {
    this.store.dispatch(new ItemFindByIdRequestAction(id));
    return this.cache.get<Item>(id);
  }

}
