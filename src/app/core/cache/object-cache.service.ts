import { combineLatest as observableCombineLatest, Observable } from 'rxjs';

import { distinctUntilChanged, filter, first, map, mergeMap, take, } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MemoizedSelector, select, Store } from '@ngrx/store';
import { IndexName } from '../index/index.reducer';

import { CacheableObject, ObjectCacheEntry } from './object-cache.reducer';
import {
  AddPatchObjectCacheAction,
  AddToObjectCacheAction,
  ApplyPatchObjectCacheAction,
  RemoveFromObjectCacheAction
} from './object-cache.actions';
import { hasNoValue, isNotEmpty } from '../../shared/empty.util';
import { GenericConstructor } from '../shared/generic-constructor';
import { coreSelector, CoreState } from '../core.reducers';
import { pathSelector } from '../shared/selectors';
import { NormalizedObjectFactory } from './models/normalized-object-factory';
import { NormalizedObject } from './models/normalized-object.model';
import { applyPatch, Operation } from 'fast-json-patch';
import { AddToSSBAction } from './server-sync-buffer.actions';
import { RestRequestMethod } from '../data/rest-request-method';

function selfLinkFromUuidSelector(uuid: string): MemoizedSelector<CoreState, string> {
  return pathSelector<CoreState, string>(coreSelector, 'index', IndexName.OBJECT, uuid);
}

function entryFromSelfLinkSelector(selfLink: string): MemoizedSelector<CoreState, ObjectCacheEntry> {
  return pathSelector<CoreState, ObjectCacheEntry>(coreSelector, 'cache/object', selfLink);
}

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
  remove(uuid: string): void {
    this.store.dispatch(new RemoveFromObjectCacheAction(uuid));
  }

  /**
   * Get an observable of the object with the specified UUID
   *
   * The type needs to be specified as well, in order to turn
   * the cached plain javascript object in to an instance of
   * a class.
   *
   * e.g. getByUUID('c96588c6-72d3-425d-9d47-fa896255a695', Item)
   *
   * @param uuid
   *    The UUID of the object to get
   * @param type
   *    The type of the object to get
   * @return Observable<T>
   *    An observable of the requested object
   */
  getByUUID<T extends NormalizedObject>(uuid: string): Observable<T> {
    return this.store.pipe(
      select(selfLinkFromUuidSelector(uuid)),
      mergeMap((selfLink: string) => this.getBySelfLink(selfLink)
      )
    )
  }

  getBySelfLink<T extends NormalizedObject>(selfLink: string): Observable<T> {
    return this.getEntry(selfLink).pipe(
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
        const type: GenericConstructor<NormalizedObject> = NormalizedObjectFactory.getConstructor(entry.data.type);
        return Object.assign(new type(), entry.data) as T
      })
    );
  }

  private getEntry(selfLink: string): Observable<ObjectCacheEntry> {
    return this.store.pipe(
      select(entryFromSelfLinkSelector(selfLink)),
      filter((entry) => this.isValid(entry)),
      distinctUntilChanged()
    );
  }

  getRequestUUIDBySelfLink(selfLink: string): Observable<string> {
    return this.getEntry(selfLink).pipe(
      map((entry: ObjectCacheEntry) => entry.requestUUID),
      distinctUntilChanged());
  }

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
  getList<T extends NormalizedObject>(selfLinks: string[]): Observable<T[]> {
    return observableCombineLatest(
      selfLinks.map((selfLink: string) => this.getBySelfLink<T>(selfLink))
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
