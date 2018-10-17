import { merge as observableMerge, Observable, of as observableOf } from 'rxjs';
import {
  filter,
  find,
  first,
  map,
  mergeMap,
  reduce,
  startWith,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { MemoizedSelector, select, Store } from '@ngrx/store';
import { hasNoValue, hasValue } from '../../shared/empty.util';
import { CacheableObject } from '../cache/object-cache.reducer';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSOSuccessResponse, RestResponse } from '../cache/response.models';
import { coreSelector, CoreState } from '../core.reducers';
import { IndexName } from '../index/index.reducer';
import { pathSelector } from '../shared/selectors';
import { UUIDService } from '../shared/uuid.service';
import { RequestConfigureAction, RequestExecuteAction } from './request.actions';
import { GetRequest, RestRequest } from './request.models';

import { RequestEntry } from './request.reducer';
import { CommitSSBAction } from '../cache/server-sync-buffer.actions';
import { RestRequestMethod } from './rest-request-method';
import { getResponseFromEntry } from '../shared/operators';

@Injectable()
export class RequestService {
  private requestsOnTheirWayToTheStore: string[] = [];

  constructor(private objectCache: ObjectCacheService,
              private uuidService: UUIDService,
              private store: Store<CoreState>) {
  }

  private entryFromUUIDSelector(uuid: string): MemoizedSelector<CoreState, RequestEntry> {
    return pathSelector<CoreState, RequestEntry>(coreSelector, 'data/request', uuid);
  }

  private uuidFromHrefSelector(href: string): MemoizedSelector<CoreState, string> {
    return pathSelector<CoreState, string>(coreSelector, 'index', IndexName.REQUEST, href);
  }

  generateRequestId(): string {
    return `client/${this.uuidService.generate()}`;
  }

  isPending(request: GetRequest): boolean {
    // first check requests that haven't made it to the store yet
    if (this.requestsOnTheirWayToTheStore.includes(request.href)) {
      return true;
    }

    // then check the store
    let isPending = false;
    this.getByHref(request.href).pipe(
      take(1))
      .subscribe((re: RequestEntry) => {
        isPending = (hasValue(re) && !re.completed)
      });

    return isPending;
  }

  getByUUID(uuid: string): Observable<RequestEntry> {
    return this.store.pipe(select(this.entryFromUUIDSelector(uuid)));
  }

  getByHref(href: string): Observable<RequestEntry> {
    return this.store.pipe(
      select(this.uuidFromHrefSelector(href)),
      mergeMap((uuid: string) => this.getByUUID(uuid))
    );
  }

  // TODO to review "overrideRequest" param when https://github.com/DSpace/dspace-angular/issues/217 will be fixed
  configure<T extends CacheableObject>(request: RestRequest, forceBypassCache: boolean = false): void {
    const isGetRequest = request.method === RestRequestMethod.GET;
    if (!isGetRequest || !this.isCachedOrPending(request) || forceBypassCache) {
      this.dispatchRequest(request);
      if (isGetRequest && !forceBypassCache) {
        this.trackRequestsOnTheirWayToTheStore(request);
      }
    }
  }

  private isCachedOrPending(request: GetRequest) {
    let isCached = this.objectCache.hasBySelfLink(request.href);
    const responses: Observable<RestResponse> = this.isReusable(request.uuid).pipe(
      filter((reusable: boolean) => !isCached && reusable),
      switchMap(() => {
          return this.getByHref(request.href).pipe(
            getResponseFromEntry(),
            take(1)
          );
        }
      ));

    const errorResponses = responses.pipe(filter((response) => !response.isSuccessful), map(() => true)); // TODO add a configurable number of retries in case of an error.
    const dsoSuccessResponses = responses.pipe(
      filter((response) => response.isSuccessful && hasValue((response as DSOSuccessResponse).resourceSelfLinks)),
      map((response: DSOSuccessResponse) => response.resourceSelfLinks),
      map((resourceSelfLinks: string[]) => resourceSelfLinks
        .every((selfLink) => this.objectCache.hasBySelfLink(selfLink))
      ));
    const otherSuccessResponses = responses.pipe(filter((response) => response.isSuccessful && !hasValue((response as DSOSuccessResponse).resourceSelfLinks)), map(() => true));

    observableMerge(errorResponses, otherSuccessResponses, dsoSuccessResponses).subscribe((c) => isCached = c);

    const isPending = this.isPending(request);
    return isCached || isPending;
  }

  private dispatchRequest(request: RestRequest) {
    this.store.dispatch(new RequestConfigureAction(request));
    this.store.dispatch(new RequestExecuteAction(request.uuid));
  }

  /**
   * ngrx action dispatches are asynchronous. But this.isPending needs to return true as soon as the
   * configure method for a GET request has been executed, otherwise certain requests will happen multiple times.
   *
   * This method will store the href of every GET request that gets configured in a local variable, and
   * remove it as soon as it can be found in the store.
   */
  private trackRequestsOnTheirWayToTheStore(request: GetRequest) {
    this.requestsOnTheirWayToTheStore = [...this.requestsOnTheirWayToTheStore, request.href];
    this.store.pipe(select(this.entryFromUUIDSelector(request.href)),
      filter((re: RequestEntry) => hasValue(re)),
      take(1)
    ).subscribe((re: RequestEntry) => {
      this.requestsOnTheirWayToTheStore = this.requestsOnTheirWayToTheStore.filter((pendingHref: string) => pendingHref !== request.href)
    });
  }

  commit(method?: RestRequestMethod) {
    this.store.dispatch(new CommitSSBAction(method))
  }

  /**
   * Check whether a ResponseCacheEntry should still be cached
   *
   * @param entry
   *    the entry to check
   * @return boolean
   *    false if the entry is null, undefined, or its time to
   *    live has been exceeded, true otherwise
   */
  private isReusable(uuid: string): Observable<boolean> {
    if (hasNoValue(uuid)) {
      return observableOf(false);
    } else {
      const requestEntry$ = this.getByUUID(uuid);
      return requestEntry$.pipe(
        filter((entry: RequestEntry) => hasValue(entry) && hasValue(entry.response)),
        map((entry: RequestEntry) => {
          if (hasValue(entry) && entry.response.isSuccessful) {
            const timeOutdated = entry.response.timeAdded + entry.request.responseMsToLive;
            const isOutDated = new Date().getTime() > timeOutdated;
            return !isOutDated;
          } else {
            return false;
          }
        })
      );
      return observableOf(false);
    }
  }
}
