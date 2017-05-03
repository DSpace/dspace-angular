import { Injectable } from "@angular/core";
import { GenericConstructor } from "../../shared/generic-constructor";
import { CacheableObject } from "../object-cache.reducer";
import { ObjectCacheService } from "../object-cache.service";
import { RequestService } from "../../data/request.service";
import { ResponseCacheService } from "../response-cache.service";
import { Store } from "@ngrx/store";
import { CoreState } from "../../core.reducers";
import { RequestEntry } from "../../data/request.reducer";
import { hasValue, isNotEmpty } from "../../../shared/empty.util";
import { ResponseCacheEntry } from "../response-cache.reducer";
import { ErrorResponse, SuccessResponse } from "../response-cache.models";
import { Observable } from "rxjs/Observable";
import { RemoteData } from "../../data/remote-data";
import { DomainModelBuilder } from "./domain-model-builder";

@Injectable()
export class RemoteDataBuildService {
  constructor(
    protected objectCache: ObjectCacheService,
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected store: Store<CoreState>,
  ) {
  }

  buildSingle<TNormalized extends CacheableObject, TDomain>(
    href: string,
    normalizedType: GenericConstructor<TNormalized>,
    builder: DomainModelBuilder<TNormalized, TDomain>
  ): RemoteData<TDomain> {
    const requestObs = this.store.select<RequestEntry>('core', 'data', 'request', href);
    const responseCacheObs = this.responseCache.get(href);

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
        this.objectCache.getBySelfLink<TNormalized>(href, normalizedType),
        responseCacheObs
          .filter((entry: ResponseCacheEntry) => hasValue(entry) && entry.response.isSuccessful)
          .map((entry: ResponseCacheEntry) => (<SuccessResponse> entry.response).resourceUUIDs)
          .flatMap((resourceUUIDs: Array<string>) => {
            if (isNotEmpty(resourceUUIDs)) {
              return this.objectCache.get(resourceUUIDs[0], normalizedType);
            }
            else {
              return Observable.of(undefined);
            }
          })
          .distinctUntilChanged()
      ).map((normalized: TNormalized) => builder
        .setHref(href)
        .setNormalized(normalized)
        .build()
      );

    return new RemoteData(
      href,
      requestPending,
      responsePending,
      isSuccessFul,
      errorMessage,
      payload
    );
  }

  buildList<TNormalized extends CacheableObject, TDomain>(
    href: string,
    normalizedType: GenericConstructor<TNormalized>,
    builder: DomainModelBuilder<TNormalized, TDomain>
  ): RemoteData<TDomain[]> {
    const requestObs = this.store.select<RequestEntry>('core', 'data', 'request', href);
    const responseCacheObs = this.responseCache.get(href);

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
        return this.objectCache.getList(resourceUUIDs, normalizedType)
          .map((normList: TNormalized[]) => {
            return normList.map((normalized: TNormalized) => {
              return builder
                .setHref(href)
                .setNormalized(normalized)
                .build();
            });
          });
      })
      .distinctUntilChanged();

    return new RemoteData(
      href,
      requestPending,
      responsePending,
      isSuccessFul,
      errorMessage,
      payload
    );
  }
}
