import { Injectable } from '@angular/core';

import { createSelector, MemoizedSelector, select, Store } from '@ngrx/store';
import { Observable, race as observableRace } from 'rxjs';
import { filter, mergeMap, take } from 'rxjs/operators';

import { AppState } from '../../app.reducer';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { CacheableObject } from '../cache/object-cache.reducer';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { IndexName, IndexState, MetaIndexState } from '../index/index.reducer';
import {
  originalRequestUUIDFromRequestUUIDSelector,
  requestIndexSelector,
  uuidFromHrefSelector
} from '../index/index.selectors';
import { UUIDService } from '../shared/uuid.service';
import { RequestConfigureAction, RequestExecuteAction, RequestRemoveAction } from './request.actions';
import { GetRequest, RestRequest } from './request.models';
import { RequestEntry, RequestState } from './request.reducer';
import { CommitSSBAction } from '../cache/server-sync-buffer.actions';
import { RestRequestMethod } from './rest-request-method';
import { AddToIndexAction, RemoveFromIndexBySubstringAction } from '../index/index.actions';
import { coreSelector } from '../core.selectors';

/**
 * The base selector function to select the request state in the store
 */
const requestCacheSelector = createSelector(
  coreSelector,
  (state: CoreState) => state['data/request']
);

/**
 * Selector function to select a request entry by uuid from the cache
 * @param uuid The uuid of the request
 */
const entryFromUUIDSelector = (uuid: string): MemoizedSelector<CoreState, RequestEntry> => createSelector(
  requestCacheSelector,
  (state: RequestState) => {
    return hasValue(state) ? state[uuid] : undefined;
  }
);

/**
 * Create a selector that fetches a list of request UUIDs from a given index substate of which the request href
 * contains a given substring
 * @param selector    MemoizedSelector to start from
 * @param name        The name of the index substate we're fetching request UUIDs from
 * @param href        Substring that the request's href should contain
 */
const uuidsFromHrefSubstringSelector =
  (selector: MemoizedSelector<AppState, IndexState>, href: string): MemoizedSelector<AppState, string[]> => createSelector(
    selector,
    (state: IndexState) => getUuidsFromHrefSubstring(state, href)
  );

/**
 * Fetch a list of request UUIDs from a given index substate of which the request href contains a given substring
 * @param state   The IndexState
 * @param href    Substring that the request's href should contain
 */
const getUuidsFromHrefSubstring = (state: IndexState, href: string): string[] => {
  let result = [];
  if (isNotEmpty(state)) {
    result = Object.values(state)
      .filter((value: string) => value.startsWith(href));
  }
  return result;
};

/**
 * A service to interact with the request state in the store
 */
@Injectable()
export class RequestService {
  private requestsOnTheirWayToTheStore: string[] = [];

  constructor(private objectCache: ObjectCacheService,
              private uuidService: UUIDService,
              private store: Store<CoreState>,
              private indexStore: Store<MetaIndexState>) {
  }

  generateRequestId(): string {
    return `client/${this.uuidService.generate()}`;
  }

  /**
   * Check if a request is currently pending
   */
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

  /**
   * Retrieve a RequestEntry based on their uuid
   */
  getByUUID(uuid: string): Observable<RequestEntry> {
    return observableRace(
      this.store.pipe(select(entryFromUUIDSelector(uuid))),
      this.store.pipe(
        select(originalRequestUUIDFromRequestUUIDSelector(uuid)),
        mergeMap((originalUUID) => {
            return this.store.pipe(select(entryFromUUIDSelector(originalUUID)))
          },
        ))
    );
  }

  /**
   * Retrieve a RequestEntry based on their href
   */
  getByHref(href: string): Observable<RequestEntry> {
    return this.store.pipe(
      select(uuidFromHrefSelector(href)),
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
      select(uuidsFromHrefSubstringSelector(requestIndexSelector, href)),
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
  private isCachedOrPending(request: GetRequest): boolean {
    const inReqCache = this.hasByHref(request.href);
    const inObjCache = this.objectCache.hasBySelfLink(request.href);
    const isCached = inReqCache || inObjCache;

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
    this.getByHref(request.href).pipe(
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
   * Check whether a cached response should still be valid
   *
   * @param entry
   *    the entry to check
   * @return boolean
   *    false if the uuid has no value, the response was not successful or its time to
   *    live was exceeded, true otherwise
   */
  private isValid(entry: RequestEntry): boolean {
    if (hasValue(entry) && entry.completed && entry.response.isSuccessful) {
      const timeOutdated = entry.response.timeAdded + entry.request.responseMsToLive;
      const isOutDated = new Date().getTime() > timeOutdated;
      return !isOutDated;
    } else {
      return false;
    }
  }

  /**
   * Check whether the request with the specified href is cached
   *
   * @param href
   *    The link of the request to check
   * @return boolean
   *    true if the request with the specified href is cached,
   *    false otherwise
   */
  hasByHref(href: string): boolean {
    let result = false;
    this.getByHref(href).pipe(
      take(1)
    ).subscribe((requestEntry: RequestEntry) => result = this.isValid(requestEntry));
    return result;
  }

}
