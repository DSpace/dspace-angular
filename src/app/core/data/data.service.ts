import { Observable } from "rxjs";
import { ObjectCacheService } from "../cache/object-cache.service";
import { ResponseCacheService } from "../cache/response-cache.service";
import { CacheableObject } from "../cache/object-cache.reducer";
import { isNotEmpty, hasValue } from "../../shared/empty.util";
import { GenericConstructor } from "../shared/generic-constructor";
import { RemoteData } from "./remote-data";
import { SuccessResponse, ErrorResponse } from "../cache/response-cache.models";
import { FindAllRequest, FindByIDRequest } from "./request.models";
import { RequestState, RequestEntry } from "./request.reducer";
import { Store } from "@ngrx/store";
import { RequestConfigureAction, RequestExecuteAction } from "./request.actions";
import { ResponseCacheEntry } from "../cache/response-cache.reducer";

export abstract class DataService<T extends CacheableObject> {
  protected abstract objectCache: ObjectCacheService;
  protected abstract responseCache: ResponseCacheService;
  protected abstract store: Store<RequestState>;
  protected abstract endpoint: string;

  constructor(private resourceType: GenericConstructor<T>) {

  }

  protected getFindAllHref(scopeID?): string {
    let result = this.endpoint;
    if (hasValue(scopeID)) {
      result += `?scope=${scopeID}`
    }
    return result;
  }

  findAll(scopeID?: string): RemoteData<Array<T>> {
    const href = this.getFindAllHref(scopeID);
    const request = new FindAllRequest(href, this.resourceType, scopeID);
    this.store.dispatch(new RequestConfigureAction(request));
    this.store.dispatch(new RequestExecuteAction(href));
    const requestObs = this.store.select('core', 'data', 'request', href);
    const responseCacheObs = this.responseCache.get(href);
    return new RemoteData(
      requestObs.map((entry: RequestEntry) => entry.requestPending).distinctUntilChanged(),
      requestObs.map((entry: RequestEntry) => entry.responsePending).distinctUntilChanged(),
      responseCacheObs
        .map((entry: ResponseCacheEntry) => entry.response.isSuccessful).distinctUntilChanged(),
      responseCacheObs
        .filter((entry: ResponseCacheEntry) => !entry.response.isSuccessful)
        .map((entry: ResponseCacheEntry) => (<ErrorResponse> entry.response).errorMessage)
        .distinctUntilChanged(),
      responseCacheObs
        .filter((entry: ResponseCacheEntry) => entry.response.isSuccessful)
        .map((entry: ResponseCacheEntry) => (<SuccessResponse> entry.response).resourceUUIDs)
        .flatMap((resourceUUIDs: Array<string>) => {
          // use those IDs to fetch the actual objects from the ObjectCache
          return this.objectCache.getList<T>(resourceUUIDs, this.resourceType);
        }).distinctUntilChanged()
    );
  }

  protected getFindByIDHref(resourceID): string {
    return `${this.endpoint}/${resourceID}`;
  }

  findById(id: string): RemoteData<T> {
    const href = this.getFindByIDHref(id);
    const request = new FindByIDRequest(href, this.resourceType, id);
    this.store.dispatch(new RequestConfigureAction(request));
    this.store.dispatch(new RequestExecuteAction(href));
    const requestObs = this.store.select('core', 'data', 'request', href);
    const responseCacheObs = this.responseCache.get(href);
    return new RemoteData(
      requestObs.map((entry: RequestEntry) => entry.requestPending).distinctUntilChanged(),
      requestObs.map((entry: RequestEntry) => entry.responsePending).distinctUntilChanged(),
      responseCacheObs
        .map((entry: ResponseCacheEntry) => entry.response.isSuccessful).distinctUntilChanged(),
      responseCacheObs
        .filter((entry: ResponseCacheEntry) => !entry.response.isSuccessful)
        .map((entry: ResponseCacheEntry) => (<ErrorResponse> entry.response).errorMessage)
        .distinctUntilChanged(),
      responseCacheObs
        .filter((entry: ResponseCacheEntry) => entry.response.isSuccessful)
        .map((entry: ResponseCacheEntry) => (<SuccessResponse> entry.response).resourceUUIDs)
        .flatMap((resourceUUIDs: Array<string>) => {
          if (isNotEmpty(resourceUUIDs)) {
            return this.objectCache.get<T>(resourceUUIDs[0], this.resourceType);
          }
          else {
            return Observable.of(undefined);
          }
        }).distinctUntilChanged()
    );
  }

}
