import { RemoteData } from "../../data/remote-data";
import { Observable } from "rxjs/Observable";
import { RequestEntry } from "../../data/request.reducer";
import { ResponseCacheEntry } from "../response-cache.reducer";
import { ErrorResponse, SuccessResponse } from "../response-cache.models";
import { Store } from "@ngrx/store";
import { CoreState } from "../../core.reducers";
import { ResponseCacheService } from "../response-cache.service";
import { ObjectCacheService } from "../object-cache.service";
import { RequestService } from "../../data/request.service";
import { CacheableObject } from "../object-cache.reducer";
import { GenericConstructor } from "../../shared/generic-constructor";
import { hasValue, isNotEmpty } from "../../../shared/empty.util";

export interface RemoteDataBuilder<T> {
  build(): RemoteData<T>
}

export abstract class SingleRemoteDataBuilder<TDomain, TNormalized extends CacheableObject> implements RemoteDataBuilder<TDomain> {

  constructor(
    protected objectCache: ObjectCacheService,
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected store: Store<CoreState>,
    protected href: string,
    protected normalizedType: GenericConstructor<TNormalized>
  ) {
  }

  protected abstract normalizedToDomain(normalized: TNormalized): TDomain;

  build(): RemoteData<TDomain> {
    const requestObs = this.store.select<RequestEntry>('core', 'data', 'request', this.href);
    const responseCacheObs = this.responseCache.get(this.href);

    const requestPending = requestObs.map((entry: RequestEntry) => hasValue(entry) && entry.requestPending).distinctUntilChanged();

    const responsePending = requestObs.map((entry: RequestEntry) => hasValue(entry) && entry.responsePending).distinctUntilChanged();

    const isSuccessFul = responseCacheObs
      .map((entry: ResponseCacheEntry) => hasValue(entry) && entry.response.isSuccessful).distinctUntilChanged();

    const errorMessage = responseCacheObs
      .filter((entry: ResponseCacheEntry) => hasValue(entry) && !entry.response.isSuccessful)
      .map((entry: ResponseCacheEntry) => (<ErrorResponse> entry.response).errorMessage)
      .distinctUntilChanged();

    const payload =
      Observable.race(
        this.objectCache.getBySelfLink<TNormalized>(this.href, this.normalizedType),
        responseCacheObs
          .filter((entry: ResponseCacheEntry) => hasValue(entry) && entry.response.isSuccessful)
          .map((entry: ResponseCacheEntry) => (<SuccessResponse> entry.response).resourceUUIDs)
          .flatMap((resourceUUIDs: Array<string>) => {
            if (isNotEmpty(resourceUUIDs)) {
              return this.objectCache.get(resourceUUIDs[0], this.normalizedType);
            }
            else {
              return Observable.of(undefined);
            }
          })
          .distinctUntilChanged()
    ).map((normalized: TNormalized) => this.normalizedToDomain(normalized));

    return new RemoteData(
      this.href,
      requestPending,
      responsePending,
      isSuccessFul,
      errorMessage,
      payload
    );
  }

}

export abstract class ListRemoteDataBuilder<TDomain, TNormalized extends CacheableObject> implements RemoteDataBuilder<TDomain[]> {

  constructor(
    protected objectCache: ObjectCacheService,
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected store: Store<CoreState>,
    protected href: string,
    protected normalizedType: GenericConstructor<TNormalized>
  ) {
  }

  protected abstract normalizedToDomain(normalized: TNormalized): TDomain;

  build(): RemoteData<TDomain[]> {
    const requestObs = this.store.select<RequestEntry>('core', 'data', 'request', this.href);
    const responseCacheObs = this.responseCache.get(this.href);

    const requestPending = requestObs.map((entry: RequestEntry) => hasValue(entry) && entry.requestPending).distinctUntilChanged();

    const responsePending = requestObs.map((entry: RequestEntry) => hasValue(entry) && entry.responsePending).distinctUntilChanged();

    const isSuccessFul = responseCacheObs
      .map((entry: ResponseCacheEntry) => hasValue(entry) && entry.response.isSuccessful).distinctUntilChanged();

    const errorMessage = responseCacheObs
      .filter((entry: ResponseCacheEntry) => hasValue(entry) && !entry.response.isSuccessful)
      .map((entry: ResponseCacheEntry) => (<ErrorResponse> entry.response).errorMessage)
      .distinctUntilChanged();

    const payload = responseCacheObs
      .filter((entry: ResponseCacheEntry) => hasValue(entry) && entry.response.isSuccessful)
      .map((entry: ResponseCacheEntry) => (<SuccessResponse> entry.response).resourceUUIDs)
      .flatMap((resourceUUIDs: Array<string>) => {
        return this.objectCache.getList(resourceUUIDs, this.normalizedType)
          .map((normList: TNormalized[]) => {
            return normList.map((normalized: TNormalized) => {
              return this.normalizedToDomain(normalized);
            });
          });
      })
      .distinctUntilChanged();

    return new RemoteData(
      this.href,
      requestPending,
      responsePending,
      isSuccessFul,
      errorMessage,
      payload
    );
  }

}
