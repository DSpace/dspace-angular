import { OpaqueToken } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { ObjectCacheService } from "../cache/object-cache.service";
import { CacheableObject } from "../cache/object-cache.reducer";
import { RequestCacheState } from "../cache/request-cache.reducer";
import { FindAllRequestCacheAction, FindByIDRequestCacheAction } from "../cache/request-cache.actions";
import { ParamHash } from "../shared/param-hash";
import { isNotEmpty } from "../../shared/empty.util";

export abstract class DataService<T extends CacheableObject> {
  abstract name: OpaqueToken;

  constructor(
    private store: Store<RequestCacheState>,
    private objectCache: ObjectCacheService
  ) { }

  findAll(scopeID?: string): Observable<Array<T>> {
    const key = new ParamHash(this.name, 'findAll', scopeID).toString();
    this.store.dispatch(new FindAllRequestCacheAction(key, this.name, scopeID));
    //get an observable of the IDs from the store
    return this.store.select<Array<string>>('core', 'cache', 'request', key, 'resourceUUIDs')
      .flatMap((resourceUUIDs: Array<string>) => {
        // use those IDs to fetch the actual objects from the cache
        return this.objectCache.getList<T>(resourceUUIDs);
      });
  }

  findById(id: string): Observable<T> {
    const key = new ParamHash(this.name, 'findById', id).toString();
    this.store.dispatch(new FindByIDRequestCacheAction(key, this.name, id));
    return this.store.select<Array<string>>('core', 'cache', 'request', key, 'resourceUUIDs')
      .flatMap((resourceUUIDs: Array<string>) => {
        if(isNotEmpty(resourceUUIDs)) {
          return this.objectCache.get<T>(resourceUUIDs[0]);
        }
        else {
          return Observable.of(undefined);
        }
      });
  }

}
