import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ObjectCacheState, ObjectCacheEntry, CacheableObject } from "./object-cache.reducer";
import { AddToObjectCacheAction, RemoveFromObjectCacheAction } from "./object-cache.actions";
import { Observable } from "rxjs";
import { hasNoValue } from "../../shared/empty.util";

/**
 * A service to interact with the object cache
 */
@Injectable()
export class ObjectCacheService {
  constructor(
    private store: Store<ObjectCacheState>
  ) {}

  /**
   * Add an object to the cache
   *
   * @param objectToCache
   *    The object to add
   * @param msToLive
   *    The number of milliseconds it should be cached for
   */
  add(objectToCache: CacheableObject, msToLive: number): void {
    this.store.dispatch(new AddToObjectCacheAction(objectToCache, new Date().getTime(), msToLive));
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
   * @param uuid
   *    The UUID of the object to get
   * @return Observable<T>
   *    An observable of the requested object
   */
  get<T extends CacheableObject>(uuid: string): Observable<T> {
    return this.store.select<ObjectCacheEntry>('core', 'cache', 'object', uuid)
      .filter(entry => this.isValid(entry))
      .distinctUntilChanged()
      .map((entry: ObjectCacheEntry) => <T> entry.data);
  }

  getBySelfLink<T extends CacheableObject>(href: string): Observable<T> {
    return this.store.select<string>('core', 'index', 'href', href)
      .flatMap((uuid: string) => this.get<T>(uuid))
  }

  /**
   * Get an observable for an array of objects
   * with the specified UUIDs
   *
   * @param uuids
   *    An array of UUIDs of the objects to get
   * @return Observable<Array<T>>
   */
  getList<T extends CacheableObject>(uuids: Array<string>): Observable<Array<T>> {
    return Observable.combineLatest(
      uuids.map((id: string) => this.get<T>(id))
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

    this.store.select<ObjectCacheEntry>('core', 'cache', 'object', uuid)
      .take(1)
      .subscribe(entry => result = this.isValid(entry));

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
    let result: boolean = false;

    this.store.select<string>('core', 'index', 'href', href)
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
    }
    else {
      const timeOutdated = entry.timeAdded + entry.msToLive;
      const isOutDated = new Date().getTime() > timeOutdated;
      if (isOutDated) {
        this.store.dispatch(new RemoveFromObjectCacheAction(entry.data.uuid));
      }
      return !isOutDated;
    }
  }

}
