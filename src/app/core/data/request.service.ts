import { Observable, merge as observableMerge } from 'rxjs';
import { filter, first, map, mergeMap, partition, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { MemoizedSelector, select, Store } from '@ngrx/store';
import { hasValue } from '../../shared/empty.util';
import { CacheableObject } from '../cache/object-cache.reducer';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSOSuccessResponse, RestResponse } from '../cache/response-cache.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { ResponseCacheService } from '../cache/response-cache.service';
import { coreSelector, CoreState } from '../core.reducers';
import { IndexName } from '../index/index.reducer';
import { pathSelector } from '../shared/selectors';
import { UUIDService } from '../shared/uuid.service';
import { RequestConfigureAction, RequestExecuteAction } from './request.actions';
import { GetRequest, RestRequest, RestRequestMethod } from './request.models';

import { RequestEntry } from './request.reducer';

@Injectable()
export class RequestService {
  private requestsOnTheirWayToTheStore: string[] = [];

  constructor(private objectCache: ObjectCacheService,
              private responseCache: ResponseCacheService,
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
    const isGetRequest = request.method === RestRequestMethod.Get;
    if (!isGetRequest || !this.isCachedOrPending(request) || forceBypassCache) {
      this.dispatchRequest(request);
      if (isGetRequest && !forceBypassCache) {
        this.trackRequestsOnTheirWayToTheStore(request);
      }
    }
  }

  private isCachedOrPending(request: GetRequest) {
    let isCached = this.objectCache.hasBySelfLink(request.href);
    if (!isCached && this.responseCache.has(request.href)) {
      const responses = this.responseCache.get(request.href).pipe(
        take(1),
        map((entry: ResponseCacheEntry) => entry.response)
      );

      const errorResponses = responses.pipe(filter((response) => !response.isSuccessful), map(() => true)); // TODO add a configurable number of retries in case of an error.
      const dsoSuccessResponses = responses.pipe(
        filter((response) => response.isSuccessful && hasValue((response as DSOSuccessResponse).resourceSelfLinks)),
        map((response: DSOSuccessResponse) => response.resourceSelfLinks),
        map((resourceSelfLinks: string[]) => resourceSelfLinks
          .every((selfLink) => this.objectCache.hasBySelfLink(selfLink))
        ));
      const otherSuccessResponses = responses.pipe(filter((response) => response.isSuccessful && !hasValue((response as DSOSuccessResponse).resourceSelfLinks)), map(() => true));

      observableMerge(errorResponses, otherSuccessResponses, dsoSuccessResponses).subscribe((c) => isCached = c);
    }
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
}
