import { Injectable } from '@angular/core';
import { MemoizedSelector, Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';

import { ObjectCacheEntry, CacheableObject } from './object-cache.reducer';
import { AddToObjectCacheAction, RemoveFromObjectCacheAction } from './object-cache.actions';
import { hasNoValue } from '../../shared/empty.util';
import { GenericConstructor } from '../shared/generic-constructor';
import { CoreState } from '../core.reducers';
import { keySelector } from '../shared/selectors';

function objectFromUuidSelector(uuid: string): MemoizedSelector<CoreState, ObjectCacheEntry> {
  return keySelector<ObjectCacheEntry>('data/object', uuid);
}

function uuidFromHrefSelector(href: string): MemoizedSelector<CoreState, string> {
  return keySelector<string>('index/href', href);
}

/**
 * A service to interact with the object cache
 */
@Injectable()
export class ObjectCacheService {
  constructor(
    private store: Store<CoreState>
  ) { }

  /**
   * Add an object to the cache
   *
   * @param objectToCache
   *    The object to add
   * @param msToLive
   *    The number of milliseconds it should be cached for
   * @param requestHref
   *    The href of the request that resulted in this object
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
   * e.g. get('c96588c6-72d3-425d-9d47-fa896255a695', Item)
   *
   * @param uuid
   *    The UUID of the object to get
   * @param type
   *    The type of the object to get
   * @return Observable<T>
   *    An observable of the requested object
   */
  get<T extends CacheableObject>(uuid: string, type: GenericConstructor<T>): Observable<T> {
    return this.getEntry(uuid)
      .map((entry: ObjectCacheEntry) => Object.assign(new type(), entry.data) as T);
  }

  getBySelfLink<T extends CacheableObject>(href: string, type: GenericConstructor<T>): Observable<T> {
    return this.store.select(uuidFromHrefSelector(href))
      .flatMap((uuid: string) => this.get(uuid, type))
  }

  private getEntry(uuid: string): Observable<ObjectCacheEntry> {
    return this.store.select(objectFromUuidSelector(uuid))
      .filter((entry) => this.isValid(entry))
      .distinctUntilChanged();
  }

  getRequestHref(uuid: string): Observable<string> {
    return this.getEntry(uuid)
      .map((entry: ObjectCacheEntry) => entry.requestHref)
      .distinctUntilChanged();
  }

  getRequestHrefBySelfLink(self: string): Observable<string> {
    return this.store.select(uuidFromHrefSelector(self))
      .flatMap((uuid: string) => this.getRequestHref(uuid));
  }

  /**
   * Get an observable for an array of objects of the same type
   * with the specified UUIDs
   *
   * The type needs to be specified as well, in order to turn
   * the cached plain javascript object in to an instance of
   * a class.
   *
   * e.g. getList([
   *        'c96588c6-72d3-425d-9d47-fa896255a695',
   *        'cff860da-cf5f-4fda-b8c9-afb7ec0b2d9e'
   *      ], Collection)
   *
   * @param uuids
   *    An array of UUIDs of the objects to get
   * @param type
   *    The type of the objects to get
   * @return Observable<Array<T>>
   */
  getList<T extends CacheableObject>(uuids: string[], type: GenericConstructor<T>): Observable<T[]> {
    return Observable.combineLatest(
      uuids.map((id: string) => this.get<T>(id, type))
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
  has(uuid: string): boolean {
    let result: boolean;

    this.store.select(objectFromUuidSelector(uuid))
      .take(1)
      .subscribe((entry) => result = this.isValid(entry));

    return result;
  }

  /**
   * Check whether the object with the specified self link is cached
   *
   * @param href
   *    The self link of the object to check
   * @return boolean
   *    true if the object with the specified self link is cached,
   *    false otherwise
   */
  hasBySelfLink(href: string): boolean {
    let result = false;

    this.store.select(uuidFromHrefSelector(href))
      .take(1)
      .subscribe((uuid: string) => result = this.has(uuid));

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
        this.store.dispatch(new RemoveFromObjectCacheAction(entry.data.uuid));
      }
      return !isOutDated;
    }
  }

}
