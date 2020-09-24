import { Injectable } from '@angular/core';
import { combineLatest as observableCombineLatest, Observable, of as observableOf, race as observableRace } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { hasValue, hasValueOperator, isEmpty, isNotEmpty, isNotUndefined } from '../../../shared/empty.util';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../../data/paginated-list';
import { RemoteData } from '../../data/remote-data';
import { RemoteDataError } from '../../data/remote-data-error';
import { RequestEntry } from '../../data/request.reducer';
import { RequestService } from '../../data/request.service';
import { filterSuccessfulResponses, getRequestFromRequestHref, getRequestFromRequestUUID, getResourceLinksFromResponse } from '../../shared/operators';
import { PageInfo } from '../../shared/page-info.model';
import { CacheableObject } from '../object-cache.reducer';
import { ObjectCacheService } from '../object-cache.service';
import { DSOSuccessResponse, ErrorResponse } from '../response.models';
import { LinkService } from './link.service';

@Injectable()
export class RemoteDataBuildService {
  constructor(protected objectCache: ObjectCacheService,
              protected linkService: LinkService,
              protected requestService: RequestService) {
  }

  /**
   * Creates a single {@link RemoteData} object based on the response of a request to the REST server, with a list of
   * {@link FollowLinkConfig} that indicate which embedded info should be added to the object
   * @param href$             Observable href of object we want to retrieve
   * @param linksToFollow     List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  buildSingle<T extends CacheableObject>(href$: string | Observable<string>, ...linksToFollow: Array<FollowLinkConfig<T>>): Observable<RemoteData<T>> {
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
        map((obj: T) =>
          this.linkService.resolveLinks(obj, ...linksToFollow)
        ),
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
        const response = reqEntry ? reqEntry.response : undefined;
        if (hasValue(response)) {
          isSuccessful = response.statusCode === 204 ||
            response.statusCode >= 200 && response.statusCode < 300 && hasValue(payload);
          const errorMessage = isSuccessful === false ? (response as ErrorResponse).errorMessage : undefined;
          if (hasValue(errorMessage)) {
            error = new RemoteDataError(
              response.statusCode,
              response.statusText,
              errorMessage
            );
          }
        }
        return new RemoteData(
          requestPending,
          responsePending,
          isSuccessful,
          error,
          payload,
          hasValue(response) ? response.statusCode : undefined

        );
      })
    );
  }

  /**
   * Creates a list of {@link RemoteData} objects based on the response of a request to the REST server, with a list of
   * {@link FollowLinkConfig} that indicate which embedded info should be added to the objects
   * @param href$             Observable href of objects we want to retrieve
   * @param linksToFollow     List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  buildList<T extends CacheableObject>(href$: string | Observable<string>, ...linksToFollow: Array<FollowLinkConfig<T>>): Observable<RemoteData<PaginatedList<T>>> {
    if (typeof href$ === 'string') {
      href$ = observableOf(href$);
    }

    const requestEntry$ = href$.pipe(getRequestFromRequestHref(this.requestService));
    const tDomainList$ = requestEntry$.pipe(
      getResourceLinksFromResponse(),
      switchMap((resourceUUIDs: string[]) => {
        return this.objectCache.getList(resourceUUIDs).pipe(
          map((objs: T[]) => {
            return objs.map((obj: T) =>
              this.linkService.resolveLinks(obj, ...linksToFollow)
            );
          }));
      }),
      startWith([]),
      distinctUntilChanged(),
    );
    const pageInfo$ = requestEntry$.pipe(
      filterSuccessfulResponses(),
      map((response: DSOSuccessResponse) => {
        if (hasValue(response.pageInfo)) {
          return Object.assign(new PageInfo(), response.pageInfo);
        }
      })
    );

    const payload$ = observableCombineLatest([tDomainList$, pageInfo$]).pipe(
      map(([tDomainList, pageInfo]) => {
        return new PaginatedList(pageInfo, tDomainList);
      })
    );

    return this.toRemoteDataObservable(requestEntry$, payload$);
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
        const rdAny = rd as any;
        const newRD = new RemoteData(rdAny.requestPending, rdAny.responsePending, rdAny.isSuccessful, rd.error, undefined);
        if (Array.isArray(rd.payload)) {
          return Object.assign(newRD, { payload: new PaginatedList(pageInfo, rd.payload) })
        } else if (isNotUndefined(rd.payload)) {
          return Object.assign(newRD, { payload: new PaginatedList(pageInfo, rd.payload.page) });
        } else {
          return Object.assign(newRD, { payload: new PaginatedList(pageInfo, []) });
        }
      })
    );
  }

}
