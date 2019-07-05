import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, select, Store } from '@ngrx/store';
import { applyPatch, Operation } from 'fast-json-patch';
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';

import { distinctUntilChanged, filter, map, mergeMap, take, } from 'rxjs/operators';
import { hasNoValue, hasValue, isNotEmpty } from '../../shared/empty.util';
import { CoreState } from '../core.reducers';
import { coreSelector } from '../core.selectors';
import { RestRequestMethod } from '../data/rest-request-method';
import { selfLinkFromUuidSelector } from '../index/index.selectors';
import { GenericConstructor } from '../shared/generic-constructor';
import { NormalizedObjectFactory } from './models/normalized-object-factory';
import { NormalizedObject } from './models/normalized-object.model';
import {
  AddPatchObjectCacheAction,
  AddToObjectCacheAction,
  ApplyPatchObjectCacheAction,
  RemoveFromObjectCacheAction
} from './object-cache.actions';

import { CacheableObject, ObjectCacheEntry, ObjectCacheState } from './object-cache.reducer';
import { AddToSSBAction } from './server-sync-buffer.actions';

/**
 * The base selector function to select the object cache in the store
 */
const objectCacheSelector = createSelector(
  coreSelector,
  (state: CoreState) => state['cache/object']
);

/**
 * Selector function to select an object entry by self link from the cache
 * @param selfLink The self link of the object
 */
const entryFromSelfLinkSelector =
  (selfLink: string): MemoizedSelector<CoreState, ObjectCacheEntry> => createSelector(
    objectCacheSelector,
    (state: ObjectCacheState) => state[selfLink],
  );

/**
 * A service to interact with the object cache
 */
@Injectable()
export class ObjectCacheService {
  constructor(private store: Store<CoreState>) {
  }

  /**
   * Add an object to the cache
   *
   * @param objectToCache
   *    The object to add
   * @param msToLive
   *    The number of milliseconds it should be cached for
   * @param requestUUID
   *    The UUID of the request that resulted in this object
   */
  add(objectToCache: CacheableObject, msToLive: number, requestUUID: string): void {
    this.store.dispatch(new AddToObjectCacheAction(objectToCache, new Date().getTime(), msToLive, requestUUID));
  }

  /**
   * Remove the object with the supplied href from the cache
   *
   * @param href
   *    The unique href of the object to be removed
   */
  remove(href: string): void {
    this.store.dispatch(new RemoveFromObjectCacheAction(href));
  }

  /**
   * Get an observable of the object with the specified UUID
   *
   * @param uuid
   *    The UUID of the object to get
   * @return Observable<NormalizedObject<T>>
   *    An observable of the requested object in normalized form
   */
  getObjectByUUID<T extends CacheableObject>(uuid: string): Observable<NormalizedObject<T>> {
    return this.store.pipe(
      select(selfLinkFromUuidSelector(uuid)),
      mergeMap((selfLink: string) => this.getObjectBySelfLink(selfLink)
      )
    )
  }

  /**
   * Get an observable of the object with the specified selfLink
   *
   * @param selfLink
   *    The selfLink of the object to get
   * @return Observable<NormalizedObject<T>>
   *    An observable of the requested object in normalized form
   */
  getObjectBySelfLink<T extends CacheableObject>(selfLink: string): Observable<NormalizedObject<T>> {
    return this.getBySelfLink(selfLink).pipe(
      map((entry: ObjectCacheEntry) => {
          if (isNotEmpty(entry.patches)) {
            const flatPatch: Operation[] = [].concat(...entry.patches.map((patch) => patch.operations));
            const patchedData = applyPatch(entry.data, flatPatch, undefined, false).newDocument;
            return Object.assign({}, entry, { data: patchedData });
          } else {
            return entry;
          }
        }
      ),
      map((entry: ObjectCacheEntry) => {
        const type: GenericConstructor<NormalizedObject<T>> = NormalizedObjectFactory.getConstructor(entry.data.type);
        return Object.assign(new type(), entry.data) as NormalizedObject<T>
      })
    );
  }

  /**
   * Get an observable of the object cache entry with the specified selfLink
   *
   * @param selfLink
   *    The selfLink of the object to get
   * @return Observable<ObjectCacheEntry>
   *    An observable of the requested object cache entry
   */
  getBySelfLink(selfLink: string): Observable<ObjectCacheEntry> {
    return this.store.pipe(
      select(entryFromSelfLinkSelector(selfLink)),
      filter((entry) => this.isValid(entry)),
      distinctUntilChanged()
    );
  }

  /**
   * Get an observable of the request's uuid with the specified selfLink
   *
   * @param selfLink
   *    The selfLink of the object to get
   * @return Observable<string>
   *    An observable of the request's uuid
   */
  getRequestUUIDBySelfLink(selfLink: string): Observable<string> {
    return this.getBySelfLink(selfLink).pipe(
      map((entry: ObjectCacheEntry) => entry.requestUUID),
      distinctUntilChanged());
  }

  /**
   * Get an observable of the request's uuid with the specified uuid
   *
   * @param uuid
   *    The uuid of the object to get
   * @return Observable<string>
   *    An observable of the request's uuid
   */
  getRequestUUIDByObjectUUID(uuid: string): Observable<string> {
    return this.store.pipe(
      select(selfLinkFromUuidSelector(uuid)),
      mergeMap((selfLink: string) => this.getRequestUUIDBySelfLink(selfLink))
    );
  }

  /**
   * Get an observable for an array of objects of the same type
   * with the specified self links
   *
   * The type needs to be specified as well, in order to turn
   * the cached plain javascript object in to an instance of
   * a class.
   *
   * e.g. getList([
   *        'http://localhost:8080/api/core/collections/c96588c6-72d3-425d-9d47-fa896255a695',
   *        'http://localhost:8080/api/core/collections/cff860da-cf5f-4fda-b8c9-afb7ec0b2d9e'
   *      ], Collection)
   *
   * @param selfLinks
   *    An array of self links of the objects to get
   * @param type
   *    The type of the objects to get
   * @return Observable<Array<T>>
   */
  getList<T extends CacheableObject>(selfLinks: string[]): Observable<Array<NormalizedObject<T>>> {
    return observableCombineLatest(
      selfLinks.map((selfLink: string) => this.getObjectBySelfLink<T>(selfLink))
    );
  }

  /**
   * Check whether the object with the specified UUID is cached
   *
   * @param uuid
   *    The UUID of the object to check
   * @return boolean
   *    true if the object with the specified UUID is cached,
   *    false otherwise
   */
  hasByUUID(uuid: string): boolean {
    let result: boolean;

    this.store.pipe(
      select(selfLinkFromUuidSelector(uuid)),
      take(1)
    ).subscribe((selfLink: string) => result = this.hasBySelfLink(selfLink));

    return result;
  }

  /**
   * Check whether the object with the specified self link is cached
   *
   * @param selfLink
   *    The self link of the object to check
   * @return boolean
   *    true if the object with the specified self link is cached,
   *    false otherwise
   */
  hasBySelfLink(selfLink: string): boolean {
    let result = false;

    this.store.pipe(select(entryFromSelfLinkSelector(selfLink)),
      take(1)
    ).subscribe((entry: ObjectCacheEntry) => result = this.isValid(entry));

    return result;
  }

  /**
   * Create an observable that emits a new value whenever the availability of the cached object changes.
   * The value it emits is a boolean stating if the object exists in cache or not.
   * @param selfLink  The self link of the object to observe
   */
  hasBySelfLinkObservable(selfLink: string): Observable<boolean> {
    return this.store.pipe(
      select(entryFromSelfLinkSelector(selfLink)),
      map((entry: ObjectCacheEntry) => this.isValid(entry))
    );
  }

  /**
   * Check whether an ObjectCacheEntry should still be cached
   *
   * @param entry
   *    the entry to check
   * @return boolean
   *    false if the entry is null, undefined, or its time to
   *    live has been exceeded, true otherwise
   */
  private isValid(entry: ObjectCacheEntry): boolean {
    if (hasNoValue(entry)) {
      return false;
    } else {
      const timeOutdated = entry.timeAdded + entry.msToLive;
      const isOutDated = new Date().getTime() > timeOutdated;
      if (isOutDated) {
        this.store.dispatch(new RemoveFromObjectCacheAction(entry.data.self));
      }
      return !isOutDated;
    }
  }

  /**
   * Add operations to the existing list of operations for an ObjectCacheEntry
   * Makes sure the ServerSyncBuffer for this ObjectCacheEntry is updated
   * @param {string} uuid
   *     the uuid of the ObjectCacheEntry
   * @param {Operation[]} patch
   *     list of operations to perform
   */
  public addPatch(selfLink: string, patch: Operation[]) {
    this.store.dispatch(new AddPatchObjectCacheAction(selfLink, patch));
    this.store.dispatch(new AddToSSBAction(selfLink, RestRequestMethod.PATCH));
  }

  /**
   * Check whether there are any unperformed operations for an ObjectCacheEntry
   *
   * @param entry
   *    the entry to check
   * @return boolean
   *    false if the entry is there are no operations left in the ObjectCacheEntry, true otherwise
   */
  private isDirty(entry: ObjectCacheEntry): boolean {
    return isNotEmpty(entry.patches);
  }

  /**
   * Apply the existing operations on an ObjectCacheEntry in the store
   * NB: this does not make any server side changes
   * @param {string} uuid
   *     the uuid of the ObjectCacheEntry
   */
  private applyPatchesToCachedObject(selfLink: string) {
    this.store.dispatch(new ApplyPatchObjectCacheAction(selfLink));
  }

}
