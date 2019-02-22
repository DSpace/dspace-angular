import { Injectable } from '@angular/core';

import { createSelector, MemoizedSelector, select, Store } from '@ngrx/store';
import { merge as observableMerge, Observable, of as observableOf, race as observableRace } from 'rxjs';
import { filter, map, mergeMap, switchMap, take } from 'rxjs/operators';

import { hasNoValue, hasValue, isNotEmpty } from '../../shared/empty.util';
import { CacheableObject } from '../cache/object-cache.reducer';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSOSuccessResponse, RestResponse } from '../cache/response.models';
import { coreSelector, CoreState } from '../core.reducers';
import { IndexName, IndexState } from '../index/index.reducer';
import { pathSelector } from '../shared/selectors';
import { UUIDService } from '../shared/uuid.service';
import { RequestConfigureAction, RequestExecuteAction, RequestRemoveAction } from './request.actions';
import { GetRequest, RestRequest } from './request.models';
import { RequestEntry } from './request.reducer';
import { CommitSSBAction } from '../cache/server-sync-buffer.actions';
import { RestRequestMethod } from './rest-request-method';
import { getResponseFromEntry } from '../shared/operators';
import { AddToIndexAction, RemoveFromIndexBySubstringAction } from '../index/index.actions';

@Injectable()
export class RequestService {
  private requestsOnTheirWayToTheStore: string[] = [];

  constructor(private objectCache: ObjectCacheService,
              private uuidService: UUIDService,
              private store: Store<CoreState>,
              private indexStore: Store<IndexState>) {
  }

  private entryFromUUIDSelector(uuid: string): MemoizedSelector<CoreState, RequestEntry> {
    return pathSelector<CoreState, RequestEntry>(coreSelector, 'data/request', uuid);
  }

  private uuidFromHrefSelector(href: string): MemoizedSelector<CoreState, string> {
    return pathSelector<CoreState, string>(coreSelector, 'index', IndexName.REQUEST, href);
  }

  private originalUUIDFromUUIDSelector(uuid: string): MemoizedSelector<CoreState, string> {
    return pathSelector<CoreState, string>(coreSelector, 'index', IndexName.UUID_MAPPING, uuid);
  }

  /**
   * Create a selector that fetches a list of request UUIDs from a given index substate of which the request href
   * contains a given substring
   * @param selector    MemoizedSelector to start from
   * @param name        The name of the index substate we're fetching request UUIDs from
   * @param href        Substring that the request's href should contain
   */
  private uuidsFromHrefSubstringSelector(selector: MemoizedSelector<any, IndexState>, name: string, href: string): MemoizedSelector<any, string[]> {
    return createSelector(selector, (state: IndexState) => this.getUuidsFromHrefSubstring(state, name, href));
  }

  /**
   * Fetch a list of request UUIDs from a given index substate of which the request href contains a given substring
   * @param state   The IndexState
   * @param name    The name of the index substate we're fetching request UUIDs from
   * @param href    Substring that the request's href should contain
   */
  private getUuidsFromHrefSubstring(state: IndexState, name: string, href: string): string[] {
    let result = [];
    if (isNotEmpty(state)) {
      const subState = state[name];
      if (isNotEmpty(subState)) {
        for (const value in subState) {
          if (value.indexOf(href) > -1) {
            result = [...result, subState[value]];
          }
        }
      }
    }
    return result;
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
    return observableRace(
      this.store.pipe(select(this.entryFromUUIDSelector(uuid))),
      this.store.pipe(
        select(this.originalUUIDFromUUIDSelector(uuid)),
        mergeMap((originalUUID) => {
            return this.store.pipe(select(this.entryFromUUIDSelector(originalUUID)))
          },
        ))
    );
  }

  getByHref(href: string): Observable<RequestEntry> {
    return this.store.pipe(
      select(this.uuidFromHrefSelector(href)),
      mergeMap((uuid: string) => this.getByUUID(uuid))
    );
  }

  /**
   * Configure a certain request
   * Used to make sure a request is in the cache
   * @param {RestRequest} request The request to send out
   * @param {boolean} forceBypassCache When true, a new request is always dispatched
   */
  // TODO to review "forceBypassCache" param when https://github.com/DSpace/dspace-angular/issues/217 will be fixed
  configure<T extends CacheableObject>(request: RestRequest, forceBypassCache: boolean = false): void {
    const isGetRequest = request.method === RestRequestMethod.GET;
    if (!isGetRequest || !this.isCachedOrPending(request) || forceBypassCache) {
      this.dispatchRequest(request);
      if (isGetRequest && !forceBypassCache) {
        this.trackRequestsOnTheirWayToTheStore(request);
      }
    } else {
      this.getByHref(request.href).pipe(
        filter((entry) => hasValue(entry)),
        take(1)
      ).subscribe((entry) => {
          return this.store.dispatch(new AddToIndexAction(IndexName.UUID_MAPPING, request.uuid, entry.request.uuid))
        }
      )
    }
  }

  /**
   * Remove all request cache providing (part of) the href
   * This also includes href-to-uuid index cache
   * @param href    A substring of the request(s) href
   */
  removeByHrefSubstring(href: string) {
    this.store.pipe(
      select(this.uuidsFromHrefSubstringSelector(pathSelector<CoreState, IndexState>(coreSelector, 'index'), IndexName.REQUEST, href)),
      take(1)
    ).subscribe((uuids: string[]) => {
      for (const uuid of uuids) {
        this.removeByUuid(uuid);
      }
    });
    this.requestsOnTheirWayToTheStore = this.requestsOnTheirWayToTheStore.filter((reqHref: string) => reqHref.indexOf(href) < 0);
    this.indexStore.dispatch(new RemoveFromIndexBySubstringAction(IndexName.REQUEST, href));
  }

  /**
   * Remove request cache using the request's UUID
   * @param uuid
   */
  removeByUuid(uuid: string) {
    this.store.dispatch(new RequestRemoveAction(uuid));
  }

  /**
   * Check if a request is in the cache or if it's still pending
   * @param {GetRequest} request The request to check
   * @returns {boolean} True if the request is cached or still pending
   */
  private isCachedOrPending(request: GetRequest) {
    let isCached = this.objectCache.hasBySelfLink(request.href);
    if (isCached) {
      const responses: Observable<RestResponse> = this.isReusable(request.uuid).pipe(
        filter((reusable: boolean) => reusable),
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
    }
    const isPending = this.isPending(request);
    return isCached || isPending;
  }

  /**
   * Configure and execute the request
   * @param {RestRequest} request to dispatch
   */
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

  /**
   * Dispatch commit action to send all changes (for a certain method) to the server (buffer)
   * @param {RestRequestMethod} method RestRequestMethod for which the changes should be committed
   */
  commit(method?: RestRequestMethod) {
    this.store.dispatch(new CommitSSBAction(method))
  }

  /**
   * Check whether a Response should still be cached
   *
   * @param uuid
   *    the uuid of the entry to check
   * @return boolean
   *    false if the uuid has no value, no entry could be found, the response was nog successful or its time to
   *    live has exceeded, true otherwise
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
    }
  }
}
