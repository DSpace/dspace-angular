import { OpaqueToken } from "@angular/core";
import { Observable } from "rxjs";
import { ObjectCacheService } from "../cache/object-cache.service";
import { RequestCacheService } from "../cache/request-cache.service";
import { CacheableObject } from "../cache/object-cache.reducer";
import { ParamHash } from "../shared/param-hash";
import { isNotEmpty } from "../../shared/empty.util";
import { GenericConstructor } from "../shared/generic-constructor";

export abstract class DataService<T extends CacheableObject> {
  abstract serviceName: OpaqueToken;
  protected abstract objectCache: ObjectCacheService;
  protected abstract requestCache: RequestCacheService;

  constructor(private modelType: GenericConstructor<T>) {

  }

  findAll(scopeID?: string): Observable<Array<T>> {
    const key = new ParamHash(this.serviceName, 'findAll', scopeID).toString();
    return this.requestCache.findAll(key, this.serviceName, scopeID)
      //get an observable of the IDs from the RequestCache
      .map(entry => entry.resourceUUIDs)
      .flatMap((resourceUUIDs: Array<string>) => {
        // use those IDs to fetch the actual objects from the ObjectCache
        return this.objectCache.getList<T>(resourceUUIDs, this.modelType);
      });
  }

  findById(id: string): Observable<T> {
    const key = new ParamHash(this.serviceName, 'findById', id).toString();
    return this.requestCache.findById(key, this.serviceName, id)
      .map(entry => entry.resourceUUIDs)
      .flatMap((resourceUUIDs: Array<string>) => {
        if(isNotEmpty(resourceUUIDs)) {
          return this.objectCache.get<T>(resourceUUIDs[0], this.modelType);
        }
        else {
          return Observable.of(undefined);
        }
      });
  }

}
