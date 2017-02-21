import { OpaqueToken } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { CacheService } from "./cache/cache.service";
import { CacheableObject } from "./cache/cache.reducer";
import { DataState } from "./data.reducer";
import { DataFindAllRequestAction, DataFindByIDRequestAction } from "./data.actions";
import { ParamHash } from "../shared/param-hash";
import { isNotEmpty } from "../../shared/empty.util";

export abstract class DataService<T extends CacheableObject> {
  abstract name: OpaqueToken;

  constructor(
    private store: Store<DataState>,
    private cache: CacheService
  ) { }

  findAll(scopeID?: string): Observable<Array<T>> {
    const key = new ParamHash(this.name, 'findAll', scopeID).toString();
    this.store.dispatch(new DataFindAllRequestAction(key, this.name, scopeID));
    //get an observable of the IDs from the store
    return this.store.select<Array<string>>('core', 'data', key, 'resourceUUIDs')
      .flatMap((resourceUUIDs: Array<string>) => {
        // use those IDs to fetch the actual objects from the cache
        return this.cache.getList<T>(resourceUUIDs);
      });
  }

  findById(id: string): Observable<T> {
    const key = new ParamHash(this.name, 'findById', id).toString();
    this.store.dispatch(new DataFindByIDRequestAction(key, this.name, id));
    return this.store.select<Array<string>>('core', 'data', key, 'resourceUUIDs')
      .flatMap((resourceUUIDs: Array<string>) => {
        if(isNotEmpty(resourceUUIDs)) {
          return this.cache.get<T>(resourceUUIDs[0]);
        }
        else {
          return Observable.of(undefined);
        }
      });
  }

}
