import { Injectable } from '@angular/core';

import { combineLatest as observableCombineLatest, Observable, of as observableOf, race as observableRace } from 'rxjs';
import { distinctUntilChanged, flatMap, map, startWith, switchMap, tap } from 'rxjs/operators';

import { hasValue, hasValueOperator, isEmpty, isNotEmpty, isNotUndefined } from '../../../shared/empty.util';
import { PaginatedList } from '../../data/paginated-list';
import { RemoteData } from '../../data/remote-data';
import { RemoteDataError } from '../../data/remote-data-error';
import { GetRequest } from '../../data/request.models';
import { RequestEntry } from '../../data/request.reducer';
import { RequestService } from '../../data/request.service';
import { NormalizedObject } from '../models/normalized-object.model';
import { ObjectCacheService } from '../object-cache.service';
import { DSOSuccessResponse, ErrorResponse } from '../response.models';
import { getMapsTo, getRelationMetadata, getRelationships } from './build-decorators';
import { PageInfo } from '../../shared/page-info.model';
import {
  filterSuccessfulResponses,
  getRequestFromRequestHref,
  getRequestFromRequestUUID,
  getResourceLinksFromResponse
} from '../../shared/operators';
import { CacheableObject, TypedObject } from '../object-cache.reducer';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/testing/utils';

@Injectable()
export class RemoteDataBuildService {
  constructor(protected objectCache: ObjectCacheService,
              protected requestService: RequestService) {
  }

  buildSingle<T extends CacheableObject>(href$: string | Observable<string>): Observable<RemoteData<T>> {
    if (typeof href$ === 'string') {
      href$ = observableOf(href$);
    }
    const requestUUID$ = href$.pipe(
      switchMap((href: string) =>
        this.objectCache.getRequestUUIDBySelfLink(href)),
    );

    const requestEntry$ = observableRace(
      href$.pipe(getRequestFromRequestHref(this.requestService)),
      requestUUID$.pipe(getRequestFromRequestUUID(this.requestService)),
    );
    // always use self link if that is cached, only if it isn't, get it via the response.
    const payload$ =
      observableCombineLatest(
        href$.pipe(
          switchMap((href: string) => this.objectCache.getObjectBySelfLink<T>(href)),
          startWith(undefined)),
        requestEntry$.pipe(
          getResourceLinksFromResponse(),
          switchMap((resourceSelfLinks: string[]) => {
            if (isNotEmpty(resourceSelfLinks)) {
              return this.objectCache.getObjectBySelfLink<T>(resourceSelfLinks[0]);
            } else {
              return observableOf(undefined);
            }
          }),
          distinctUntilChanged(),
          startWith(undefined)
        )
      ).pipe(
        map(([fromSelfLink, fromResponse]) => {
          if (hasValue(fromSelfLink)) {
            return fromSelfLink;
          } else {
            return fromResponse;
          }
        }),
        hasValueOperator(),
        map((normalized: NormalizedObject<T>) => {
          return this.build<T>(normalized);
        }),
        startWith(undefined),
        distinctUntilChanged()
      );
    return this.toRemoteDataObservable(requestEntry$, payload$);
  }

  toRemoteDataObservable<T>(requestEntry$: Observable<RequestEntry>, payload$: Observable<T>) {
    return observableCombineLatest(requestEntry$, payload$).pipe(
      map(([reqEntry, payload]) => {
        const requestPending = hasValue(reqEntry) && hasValue(reqEntry.requestPending) ? reqEntry.requestPending : true;
        const responsePending = hasValue(reqEntry) && hasValue(reqEntry.responsePending) ? reqEntry.responsePending : false;
        let isSuccessful: boolean;
        let error: RemoteDataError;
        if (hasValue(reqEntry) && hasValue(reqEntry.response)) {
          isSuccessful = reqEntry.response.isSuccessful;
          const errorMessage = isSuccessful === false ? (reqEntry.response as ErrorResponse).errorMessage : undefined;
          if (hasValue(errorMessage)) {
            error = new RemoteDataError(
              (reqEntry.response as ErrorResponse).statusCode,
              (reqEntry.response as ErrorResponse).statusText,
              errorMessage
            );
          }
        }
        return new RemoteData(
          requestPending,
          responsePending,
          isSuccessful,
          error,
          payload
        );
      })
    );
  }

  buildList<T extends CacheableObject>(href$: string | Observable<string>): Observable<RemoteData<PaginatedList<T>>> {
    if (typeof href$ === 'string') {
      href$ = observableOf(href$);
    }

    const requestEntry$ = href$.pipe(getRequestFromRequestHref(this.requestService));
    const tDomainList$ = requestEntry$.pipe(
      getResourceLinksFromResponse(),
      flatMap((resourceUUIDs: string[]) => {
        return this.objectCache.getList(resourceUUIDs).pipe(
          map((normList: Array<NormalizedObject<T>>) => {
            return normList.map((normalized: NormalizedObject<T>) => {
              return this.build<T>(normalized);
            });
          }));
      }),
      startWith([]),
      distinctUntilChanged(),
    );
    const pageInfo$ = requestEntry$.pipe(
      filterSuccessfulResponses(),
      map((response: DSOSuccessResponse) => {
        if (hasValue((response as DSOSuccessResponse).pageInfo)) {
          const resPageInfo = (response as DSOSuccessResponse).pageInfo;
          if (isNotEmpty(resPageInfo) && resPageInfo.currentPage >= 0) {
            return Object.assign({}, resPageInfo, { currentPage: resPageInfo.currentPage + 1 });
          } else {
            return resPageInfo;
          }
        }
      })
    );

    const payload$ = observableCombineLatest(tDomainList$, pageInfo$).pipe(
      map(([tDomainList, pageInfo]) => {
        return new PaginatedList(pageInfo, tDomainList);
      })
    );

    return this.toRemoteDataObservable(requestEntry$, payload$);
  }

  build<T extends CacheableObject>(normalized: NormalizedObject<T>): T {
    const links: any = {};
    const relationships = getRelationships(normalized.constructor) || [];

    relationships.forEach((relationship: string) => {
      let result;
      if (hasValue(normalized[relationship])) {
        const { resourceType, isList } = getRelationMetadata(normalized, relationship);
        const objectList = normalized[relationship].page || normalized[relationship];
        if (typeof objectList !== 'string') {
          objectList.forEach((href: string) => {
            this.requestService.configure(new GetRequest(this.requestService.generateRequestId(), href))
          });

          const rdArr = [];
          objectList.forEach((href: string) => {
            rdArr.push(this.buildSingle(href));
          });

          if (isList) {
            result = this.aggregate(rdArr);
          } else if (rdArr.length === 1) {
            result = rdArr[0];
          }
        } else {
          this.requestService.configure(new GetRequest(this.requestService.generateRequestId(), objectList));

          // The rest API can return a single URL to represent a list of resources (e.g. /items/:id/bitstreams)
          // in that case only 1 href will be stored in the normalized obj (so the isArray above fails),
          // but it should still be built as a list
          if (isList) {
            result = this.buildList(objectList);
          } else {
            result = this.buildSingle(objectList);
          }
        }

        if (hasValue(normalized[relationship].page)) {
          links[relationship] = this.toPaginatedList(result, normalized[relationship].pageInfo);
        } else {
          links[relationship] = result;
        }
      }
    });
    const domainModel = getMapsTo(normalized.constructor);
    return Object.assign(new domainModel(), normalized, links);
  }

  aggregate<T>(input: Array<Observable<RemoteData<T>>>): Observable<RemoteData<T[]>> {

    if (isEmpty(input)) {
      return createSuccessfulRemoteDataObject$([]);
    }

    return observableCombineLatest(...input).pipe(
      map((arr) => {
        // The request of an aggregate RD should be pending if at least one
        // of the RDs it's based on is still in the state RequestPending
        const requestPending: boolean = arr
          .map((d: RemoteData<T>) => d.isRequestPending)
          .find((b: boolean) => b === true);

        // The response of an aggregate RD should be pending if no requests
        // are still pending and at least one of the RDs it's based
        // on is still in the state ResponsePending
        const responsePending: boolean = !requestPending && arr
          .map((d: RemoteData<T>) => d.isResponsePending)
          .find((b: boolean) => b === true);

        let isSuccessful: boolean;
        // isSuccessful should be undefined until all responses have come in.
        // We can't know its state beforehand. We also can't say it's false
        // because that would imply a request failed.
        if (!(requestPending || responsePending)) {
          isSuccessful = arr
            .map((d: RemoteData<T>) => d.hasSucceeded)
            .every((b: boolean) => b === true);
        }

        const errorMessage: string = arr
          .map((d: RemoteData<T>) => d.error)
          .map((e: RemoteDataError, idx: number) => {
            if (hasValue(e)) {
              return `[${idx}]: ${e.message}`;
            }
          }).filter((e: string) => hasValue(e))
          .join(', ');

        const statusText: string = arr
          .map((d: RemoteData<T>) => d.error)
          .map((e: RemoteDataError, idx: number) => {
            if (hasValue(e)) {
              return `[${idx}]: ${e.statusText}`;
            }
          }).filter((c: string) => hasValue(c))
          .join(', ');

        const statusCode: number = arr
          .map((d: RemoteData<T>) => d.error)
          .map((e: RemoteDataError, idx: number) => {
            if (hasValue(e)) {
              return e.statusCode;
            }
          }).filter((c: number) => hasValue(c))
          .reduce((acc, status) => status, undefined);

        const error = new RemoteDataError(statusCode, statusText, errorMessage);

        const payload: T[] = arr.map((d: RemoteData<T>) => d.payload);

        return new RemoteData(
          requestPending,
          responsePending,
          isSuccessful,
          error,
          payload
        );
      }))
  }

  private toPaginatedList<T>(input: Observable<RemoteData<T[] | PaginatedList<T>>>, pageInfo: PageInfo): Observable<RemoteData<PaginatedList<T>>> {
    return input.pipe(
      map((rd: RemoteData<T[] | PaginatedList<T>>) => {
        if (Array.isArray(rd.payload)) {
          return Object.assign(rd, { payload: new PaginatedList(pageInfo, rd.payload) })
        } else if (isNotUndefined(rd.payload)) {
          return Object.assign(rd, { payload: new PaginatedList(pageInfo, rd.payload.page) });
        } else {
          return Object.assign(rd, { payload: new PaginatedList(pageInfo, []) });
        }
      })
    );
  }

}
