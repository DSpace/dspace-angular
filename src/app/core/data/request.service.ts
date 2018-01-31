import { Injectable } from '@angular/core';

import { createSelector, MemoizedSelector, Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
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

import { RequestEntry, RequestState } from './request.reducer';

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
    this.getByHref(request.href)
      .take(1)
      .subscribe((re: RequestEntry) => {
        isPending = (hasValue(re) && !re.completed)
      });

    return isPending;
  }

  getByUUID(uuid: string): Observable<RequestEntry> {
    return this.store.select(this.entryFromUUIDSelector(uuid));
  }

  getByHref(href: string): Observable<RequestEntry> {
    return this.store.select(this.uuidFromHrefSelector(href))
      .flatMap((uuid: string) => this.getByUUID(uuid));
  }

  configure<T extends CacheableObject>(request: RestRequest): void {
    if (request.method !== RestRequestMethod.Get || !this.isCachedOrPending(request)) {
      this.dispatchRequest(request);
    }
  }

  private isCachedOrPending(request: GetRequest) {
    let isCached = this.objectCache.hasBySelfLink(request.href);
    if (!isCached && this.responseCache.has(request.href)) {
      const [successResponse, errorResponse] = this.responseCache.get(request.href)
        .take(1)
        .map((entry: ResponseCacheEntry) => entry.response)
        .share()
        .partition((response: RestResponse) => response.isSuccessful);

      const [dsoSuccessResponse, otherSuccessResponse] = successResponse
        .share()
        .partition((response: DSOSuccessResponse) => hasValue(response.resourceSelfLinks));

      Observable.merge(
        errorResponse.map(() => true), // TODO add a configurable number of retries in case of an error.
        otherSuccessResponse.map(() => true),
        dsoSuccessResponse // a DSOSuccessResponse should only be considered cached if all its resources are cached
          .map((response: DSOSuccessResponse) => response.resourceSelfLinks)
          .map((resourceSelfLinks: string[]) => resourceSelfLinks
            .every((selfLink) => this.objectCache.hasBySelfLink(selfLink))
          )
      ).subscribe((c) => isCached = c);
    }

    const isPending = this.isPending(request);

    return isCached || isPending;
  }

  private dispatchRequest(request: RestRequest) {
    this.store.dispatch(new RequestConfigureAction(request));
    this.store.dispatch(new RequestExecuteAction(request.uuid));
    if (request.method === RestRequestMethod.Get) {
      this.trackRequestsOnTheirWayToTheStore(request);
    }
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
    this.getByHref(request.href)
      .filter((re: RequestEntry) => hasValue(re))
      .take(1)
      .subscribe((re: RequestEntry) => {
        this.requestsOnTheirWayToTheStore = this.requestsOnTheirWayToTheStore.filter((pendingHref: string) => pendingHref !== request.href)
      });
  }
}
