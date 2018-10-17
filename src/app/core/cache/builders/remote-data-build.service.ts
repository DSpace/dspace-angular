import {
  combineLatest as observableCombineLatest,
  Observable,
  of as observableOf,
  race as observableRace
} from 'rxjs';
import { Injectable } from '@angular/core';
import { distinctUntilChanged, flatMap, map, startWith, switchMap, tap } from 'rxjs/operators';
import { hasValue, hasValueOperator, isEmpty, isNotEmpty } from '../../../shared/empty.util';
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
  getRequestFromSelflink,
  getResourceLinksFromResponse
} from '../../shared/operators';

@Injectable()
export class RemoteDataBuildService {
  constructor(protected objectCache: ObjectCacheService,
              protected requestService: RequestService) {
  }

  buildSingle<TNormalized extends NormalizedObject, TDomain>(href$: string | Observable<string>): Observable<RemoteData<TDomain>> {
    if (typeof href$ === 'string') {
      href$ = observableOf(href$);
    }
    const requestHref$ = href$.pipe(
      switchMap((href: string) =>
        this.objectCache.getRequestHrefBySelfLink(href)),
    );

    const requestEntry$ = observableRace(
      href$.pipe(getRequestFromSelflink(this.requestService)),
      requestHref$.pipe(getRequestFromSelflink(this.requestService))
    );

    // always use self link if that is cached, only if it isn't, get it via the response.
    const payload$ =
      observableCombineLatest(
        href$.pipe(
          flatMap((href: string) => this.objectCache.getBySelfLink<TNormalized>(href)),
          startWith(undefined)
        ),
        requestEntry$.pipe(
          getResourceLinksFromResponse(),
          flatMap((resourceSelfLinks: string[]) => {
            if (isNotEmpty(resourceSelfLinks)) {
              return this.objectCache.getBySelfLink(resourceSelfLinks[0]);
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
        map((normalized: TNormalized) => {
          return this.build<TNormalized, TDomain>(normalized);
        }),
        startWith(undefined),
        distinctUntilChanged()
      );
    return this.toRemoteDataObservable(requestEntry$, payload$);
  }

  toRemoteDataObservable<T>(requestEntry$: Observable<RequestEntry>, payload$: Observable<T>) {
    return observableCombineLatest(requestEntry$, requestEntry$.pipe(startWith(undefined)), payload$).pipe(
      map(([reqEntry, payload]) => {
        const requestPending = hasValue(reqEntry.requestPending) ? reqEntry.requestPending : true;
        const responsePending = hasValue(reqEntry.responsePending) ? reqEntry.responsePending : false;
        let isSuccessful: boolean;
        let error: RemoteDataError;
        if (hasValue(reqEntry) && hasValue(reqEntry.response)) {
          isSuccessful = reqEntry.response.isSuccessful;
          const errorMessage = isSuccessful === false ? (reqEntry.response as ErrorResponse).errorMessage : undefined;
          if (hasValue(errorMessage)) {
            error = new RemoteDataError(reqEntry.response.statusCode, errorMessage);
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

  buildList<TNormalized extends NormalizedObject, TDomain>(href$: string | Observable<string>): Observable<RemoteData<PaginatedList<TDomain>>> {
    if (typeof href$ === 'string') {
      href$ = observableOf(href$);
    }

    const requestEntry$ = href$.pipe(getRequestFromSelflink(this.requestService));
    const tDomainList$ = requestEntry$.pipe(
      getResourceLinksFromResponse(),
      flatMap((resourceUUIDs: string[]) => {
        return this.objectCache.getList(resourceUUIDs).pipe(
          map((normList: TNormalized[]) => {
            return normList.map((normalized: TNormalized) => {
              return this.build<TNormalized, TDomain>(normalized);
            });
          }));
      }),
      startWith([]),
      distinctUntilChanged()
    );
    // tDomainList$.subscribe((t) => {console.log('domainlist', t)});
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

  build<TNormalized, TDomain>(normalized: TNormalized): TDomain {
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
          links[relationship] = this.aggregatePaginatedList(result, normalized[relationship].pageInfo);
        } else {
          links[relationship] = result;
        }
      }
    });
    const domainModel = getMapsTo(normalized.constructor);
    // console.log('domain model', normalized);

    return Object.assign(new domainModel(), normalized, links);
  }

  aggregate<T>(input: Array<Observable<RemoteData<T>>>): Observable<RemoteData<T[]>> {

    if (isEmpty(input)) {
      return observableOf(new RemoteData(false, false, true, null, []));
    }

    return observableCombineLatest(...input).pipe(
      map((arr) => {
        const requestPending: boolean = arr
          .map((d: RemoteData<T>) => d.isRequestPending)
          .every((b: boolean) => b === true);

        const responsePending: boolean = arr
          .map((d: RemoteData<T>) => d.isResponsePending)
          .every((b: boolean) => b === true);

        const isSuccessful: boolean = arr
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
          isSuccessful,
          error,
          payload
        );
      }))
  }

  aggregatePaginatedList<T>(input: Observable<RemoteData<T[]>>, pageInfo: PageInfo): Observable<RemoteData<PaginatedList<T>>> {
    return input.pipe(map((rd) => Object.assign(rd, { payload: new PaginatedList(pageInfo, rd.payload) })));
  }

}
