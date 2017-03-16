import { OpaqueToken } from "@angular/core";
import { Observable } from "rxjs";
import { ObjectCacheService } from "../cache/object-cache.service";
import { RequestCacheService } from "../cache/request-cache.service";
import { CacheableObject } from "../cache/object-cache.reducer";
import { ParamHash } from "../shared/param-hash";
import { isNotEmpty } from "../../shared/empty.util";
import { GenericConstructor } from "../shared/generic-constructor";
import { RemoteData } from "./remote-data";

export abstract class DataService<T extends CacheableObject> {
  abstract serviceName: OpaqueToken;
  protected abstract objectCache: ObjectCacheService;
  protected abstract requestCache: RequestCacheService;

  constructor(private modelType: GenericConstructor<T>) {

  }

  findAll(scopeID?: string): RemoteData<Array<T>> {
    const key = new ParamHash(this.serviceName, 'findAll', scopeID).toString();
    const requestCacheObs = this.requestCache.findAll(key, this.serviceName, scopeID);
    return new RemoteData(
      requestCacheObs.map(entry => entry.isLoading).distinctUntilChanged(),
      requestCacheObs.map(entry => entry.errorMessage).distinctUntilChanged(),
      requestCacheObs
        .map(entry => entry.resourceUUIDs)
        .flatMap((resourceUUIDs: Array<string>) => {
          // use those IDs to fetch the actual objects from the ObjectCache
          return this.objectCache.getList<T>(resourceUUIDs, this.modelType);
        }).distinctUntilChanged()
    );
  }

  findById(id: string): RemoteData<T> {
    const key = new ParamHash(this.serviceName, 'findById', id).toString();
    const requestCacheObs = this.requestCache.findById(key, this.serviceName, id);
    return new RemoteData(
      requestCacheObs.map(entry => entry.isLoading).distinctUntilChanged(),
      requestCacheObs.map(entry => entry.errorMessage).distinctUntilChanged(),
      requestCacheObs
        .map(entry => entry.resourceUUIDs)
        .flatMap((resourceUUIDs: Array<string>) => {
          if (isNotEmpty(resourceUUIDs)) {
            return this.objectCache.get<T>(resourceUUIDs[0], this.modelType);
          }
          else {
            return Observable.of(undefined);
          }
        }).distinctUntilChanged()
    );
  }

}
