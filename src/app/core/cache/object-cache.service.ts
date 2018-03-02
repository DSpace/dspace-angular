import { Injectable } from '@angular/core';
import { MemoizedSelector, Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { IndexName } from '../index/index.reducer';

import { ObjectCacheEntry, CacheableObject } from './object-cache.reducer';
import { AddToObjectCacheAction, RemoveFromObjectCacheAction } from './object-cache.actions';
import { hasNoValue } from '../../shared/empty.util';
import { GenericConstructor } from '../shared/generic-constructor';
import { coreSelector, CoreState } from '../core.reducers';
import { pathSelector } from '../shared/selectors';
import { Item } from '../shared/item.model';
import { NormalizedObjectFactory } from './models/normalized-object-factory';
import { NormalizedObject } from './models/normalized-object.model';

function selfLinkFromUuidSelector(uuid: string): MemoizedSelector<CoreState, string> {
  return pathSelector<CoreState, string>(coreSelector, 'index', IndexName.OBJECT, uuid);
}

function entryFromSelfLinkSelector(selfLink: string): MemoizedSelector<CoreState, ObjectCacheEntry> {
  return pathSelector<CoreState, ObjectCacheEntry>(coreSelector, 'data/object', selfLink);
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
   * @param requestHref
   *    The selfLink of the request that resulted in this object
   *    This isn't necessarily the same as the object's self
   *    link, it could have been part of a list for example
   */
  add(objectToCache: CacheableObject, msToLive: number, requestHref: string): void {
    this.store.dispatch(new AddToObjectCacheAction(objectToCache, new Date().getTime(), msToLive, requestHref));
  }

  /**
   * Remove the object with the supplied UUID from the cache
   *
   * @param uuid
   *    The UUID of the object to be removed
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
    return this.store.select(selfLinkFromUuidSelector(uuid))
      .flatMap((selfLink: string) => this.getBySelfLink(selfLink))
  }

  getBySelfLink<T extends NormalizedObject>(selfLink: string): Observable<T> {
    return this.getEntry(selfLink)
      .map((entry: ObjectCacheEntry) => {
        const type: GenericConstructor<NormalizedObject>= NormalizedObjectFactory.getConstructor(entry.data.type);
        return Object.assign(new type(), entry.data) as T
      });
  }

  private getEntry(selfLink: string): Observable<ObjectCacheEntry> {
    return this.store.select(entryFromSelfLinkSelector(selfLink))
      .filter((entry) => this.isValid(entry))
      .distinctUntilChanged();
  }

  getRequestHrefBySelfLink(selfLink: string): Observable<string> {
    return this.getEntry(selfLink)
      .map((entry: ObjectCacheEntry) => entry.requestHref)
      .distinctUntilChanged();
  }

  getRequestHrefByUUID(uuid: string): Observable<string> {
    return this.store.select(selfLinkFromUuidSelector(uuid))
      .flatMap((selfLink: string) => this.getRequestHrefBySelfLink(selfLink));
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
  getList<T extends NormalizedObject>(selfLinks: string[], type: GenericConstructor<T>): Observable<T[]> {
    return Observable.combineLatest(
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

    this.store.select(selfLinkFromUuidSelector(uuid))
      .take(1)
      .subscribe((selfLink: string) => result = this.hasBySelfLink(selfLink));

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

    this.store.select(entryFromSelfLinkSelector(selfLink))
      .take(1)
      .subscribe((entry: ObjectCacheEntry) => result = this.isValid(entry));

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

}
