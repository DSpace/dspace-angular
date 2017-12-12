import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PaginatedList } from '../../data/paginated-list';
import { RemoteDataError } from '../../data/remote-data-error';

import { CacheableObject } from '../object-cache.reducer';
import { ObjectCacheService } from '../object-cache.service';
import { RequestService } from '../../data/request.service';
import { ResponseCacheService } from '../response-cache.service';
import { RequestEntry } from '../../data/request.reducer';
import { hasValue, isNotEmpty } from '../../../shared/empty.util';
import { ResponseCacheEntry } from '../response-cache.reducer';
import { ErrorResponse, DSOSuccessResponse } from '../response-cache.models';
import { RemoteData } from '../../data/remote-data';
import { GenericConstructor } from '../../shared/generic-constructor';
import { getMapsTo, getRelationMetadata, getRelationships } from './build-decorators';
import { NormalizedObjectFactory } from '../models/normalized-object-factory';
import { RestRequest } from '../../data/request.models';
import { PageInfo } from '../../shared/page-info.model';

@Injectable()
export class RemoteDataBuildService {
  constructor(
    protected objectCache: ObjectCacheService,
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService
  ) {
  }

  buildSingle<TNormalized extends CacheableObject, TDomain>(
    hrefObs: string | Observable<string>,
    normalizedType: GenericConstructor<TNormalized>
  ): Observable<RemoteData<TDomain>> {
    if (typeof hrefObs === 'string') {
      hrefObs = Observable.of(hrefObs);
    }

    const requestHrefObs = hrefObs.flatMap((href: string) =>
      this.objectCache.getRequestHrefBySelfLink(href));

    const requestObs = Observable.race(
      hrefObs.flatMap((href: string) => this.requestService.getByHref(href))
        .filter((entry) => hasValue(entry)),
      requestHrefObs.flatMap((requestHref) =>
        this.requestService.getByHref(requestHref)).filter((entry) => hasValue(entry))
    );

    const responseCacheObs = Observable.race(
      hrefObs.flatMap((href: string) => this.responseCache.get(href))
        .filter((entry) => hasValue(entry)),
      requestHrefObs.flatMap((requestHref) => this.responseCache.get(requestHref)).filter((entry) => hasValue(entry))
    );

    // always use self link if that is cached, only if it isn't, get it via the response.
    const payloadObs =
      Observable.combineLatest(
        hrefObs.flatMap((href: string) => this.objectCache.getBySelfLink<TNormalized>(href, normalizedType))
          .startWith(undefined),
        responseCacheObs
          .filter((entry: ResponseCacheEntry) => entry.response.isSuccessful)
          .map((entry: ResponseCacheEntry) => (entry.response as DSOSuccessResponse).resourceSelfLinks)
          .flatMap((resourceSelfLinks: string[]) => {
            if (isNotEmpty(resourceSelfLinks)) {
              return this.objectCache.getBySelfLink(resourceSelfLinks[0], normalizedType);
            } else {
              return Observable.of(undefined);
            }
          })
          .distinctUntilChanged()
          .startWith(undefined),
        (fromSelfLink, fromResponse) => {
          if (hasValue(fromSelfLink)) {
            return fromSelfLink;
          } else {
            return fromResponse;
          }
        }
      ).filter((normalized) => hasValue(normalized))
        .map((normalized: TNormalized) => {
          return this.build<TNormalized, TDomain>(normalized);
        })
        .startWith(undefined)
        .distinctUntilChanged();
    return this.toRemoteDataObservable(hrefObs, requestObs, responseCacheObs, payloadObs);
  }

  private toRemoteDataObservable<T>(hrefObs: Observable<string>, requestObs: Observable<RequestEntry>, responseCacheObs: Observable<ResponseCacheEntry>, payloadObs: Observable<T>) {
    return Observable.combineLatest(hrefObs, requestObs, responseCacheObs.startWith(undefined), payloadObs,
      (href: string, reqEntry: RequestEntry, resEntry: ResponseCacheEntry, payload: T) => {
        const requestPending = hasValue(reqEntry.requestPending) ? reqEntry.requestPending : true;
        const responsePending = hasValue(reqEntry.responsePending) ? reqEntry.responsePending : false;
        let isSuccessFul: boolean;
        let error: RemoteDataError;
        if (hasValue(resEntry) && hasValue(resEntry.response)) {
          isSuccessFul = resEntry.response.isSuccessful;
          const errorMessage = isSuccessFul === false ? (resEntry.response as ErrorResponse).errorMessage : undefined;
          error = new RemoteDataError(resEntry.response.statusCode, errorMessage);
        }

        return new RemoteData(
          requestPending,
          responsePending,
          isSuccessFul,
          error,
          payload
        );
      });
  }

  buildList<TNormalized extends CacheableObject, TDomain>(
    hrefObs: string | Observable<string>,
    normalizedType: GenericConstructor<TNormalized>
  ): Observable<RemoteData<TDomain[] | PaginatedList<TDomain>>> {
    if (typeof hrefObs === 'string') {
      hrefObs = Observable.of(hrefObs);
    }

    const requestObs = hrefObs.flatMap((href: string) => this.requestService.getByHref(href))
      .filter((entry) => hasValue(entry));
    const responseCacheObs = hrefObs.flatMap((href: string) => this.responseCache.get(href))
      .filter((entry) => hasValue(entry));

    const tDomainListObs = responseCacheObs
      .filter((entry: ResponseCacheEntry) => entry.response.isSuccessful)
      .map((entry: ResponseCacheEntry) => (entry.response as DSOSuccessResponse).resourceSelfLinks)
      .flatMap((resourceUUIDs: string[]) => {
        return this.objectCache.getList(resourceUUIDs, normalizedType)
          .map((normList: TNormalized[]) => {
            return normList.map((normalized: TNormalized) => {
              return this.build<TNormalized, TDomain>(normalized);
            });
          });
      })
      .startWith([])
      .distinctUntilChanged();

    const pageInfoObs = responseCacheObs
      .filter((entry: ResponseCacheEntry) => entry.response.isSuccessful)
      .map((entry: ResponseCacheEntry) => {
        if (hasValue((entry.response as DSOSuccessResponse).pageInfo)) {
          const resPageInfo = (entry.response as DSOSuccessResponse).pageInfo;
          if (isNotEmpty(resPageInfo) && resPageInfo.currentPage >= 0) {
            return Object.assign({}, resPageInfo, { currentPage: resPageInfo.currentPage + 1 });
          } else {
            return resPageInfo;
          }
        }
      });

    const payloadObs = Observable.combineLatest(tDomainListObs, pageInfoObs, (tDomainList, pageInfo) => {
      if (hasValue(pageInfo)) {
        return new PaginatedList(pageInfo, tDomainList);
      } else {
        return tDomainList;
      }
    });

    return this.toRemoteDataObservable(hrefObs, requestObs, responseCacheObs, payloadObs);
  }

  build<TNormalized extends CacheableObject, TDomain>(normalized: TNormalized): TDomain {
    const links: any = {};

    const relationships = getRelationships(normalized.constructor) || [];

    relationships.forEach((relationship: string) => {
      if (hasValue(normalized[relationship])) {
        const { resourceType, isList } = getRelationMetadata(normalized, relationship);
        const resourceConstructor = NormalizedObjectFactory.getConstructor(resourceType);
        if (Array.isArray(normalized[relationship])) {
          normalized[relationship].forEach((href: string) => {
            this.requestService.configure(new RestRequest(this.requestService.generateRequestId(), href))
          });

          const rdArr = [];
          normalized[relationship].forEach((href: string) => {
            rdArr.push(this.buildSingle(href, resourceConstructor));
          });

          if (isList) {
            links[relationship] = this.aggregate(rdArr);
          } else if (rdArr.length === 1) {
            links[relationship] = rdArr[0];
          }
        } else {
          this.requestService.configure(new RestRequest(this.requestService.generateRequestId(), normalized[relationship]));

          // The rest API can return a single URL to represent a list of resources (e.g. /items/:id/bitstreams)
          // in that case only 1 href will be stored in the normalized obj (so the isArray above fails),
          // but it should still be built as a list
          if (isList) {
            links[relationship] = this.buildList(normalized[relationship], resourceConstructor);
          } else {
            links[relationship] = this.buildSingle(normalized[relationship], resourceConstructor);
          }
        }
      }
    });

    const domainModel = getMapsTo(normalized.constructor);
    return Object.assign(new domainModel(), normalized, links);
  }

  aggregate<T>(input: Array<Observable<RemoteData<T>>>): Observable<RemoteData<T[]>> {
    return Observable.combineLatest(
      ...input,
      (...arr: Array<RemoteData<T>>) => {
        const requestPending: boolean = arr
          .map((d: RemoteData<T>) => d.isRequestPending)
          .every((b: boolean) => b === true);

        const responsePending: boolean = arr
          .map((d: RemoteData<T>) => d.isResponsePending)
          .every((b: boolean) => b === true);

        const isSuccessFul: boolean = arr
          .map((d: RemoteData<T>) => d.hasSucceeded)
          .every((b: boolean) => b === true);

        const errorMessage: string = arr
          .map((d: RemoteData<T>) => d.error)
          .map((e: RemoteDataError, idx: number) => {
            if (hasValue(e)) {
              return `[${idx}]: ${e.message}`;
            }
          }).filter((e: string) => hasValue(e))
          .join(', ');

        const statusCode: string = arr
          .map((d: RemoteData<T>) => d.error)
          .map((e: RemoteDataError, idx: number) => {
            if (hasValue(e)) {
              return `[${idx}]: ${e.statusCode}`;
            }
          }).filter((c: string) => hasValue(c))
          .join(', ');

        const error = new RemoteDataError(statusCode, errorMessage);

        const payload: T[] = arr.map((d: RemoteData<T>) => d.payload);

        return new RemoteData(
          requestPending,
          responsePending,
          isSuccessFul,
          error,
          payload
        );
      })
  }

}
