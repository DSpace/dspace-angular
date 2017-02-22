import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ObjectCacheState, ObjectCacheEntry, CacheableObject } from "./object-cache.reducer";
import { AddToObjectCacheAction, RemoveFromObjectCacheAction } from "./object-cache.actions";
import { Observable } from "rxjs";
import { hasNoValue } from "../../shared/empty.util";

@Injectable()
export class ObjectCacheService {
  constructor(
    private store: Store<ObjectCacheState>
  ) {}

  add(objectToCache: CacheableObject, msToLive: number): void {
    this.store.dispatch(new AddToObjectCacheAction(objectToCache, msToLive));
  }

  remove(uuid: string): void {
    this.store.dispatch(new RemoveFromObjectCacheAction(uuid));
  }

  get<T extends CacheableObject>(uuid: string): Observable<T> {
    return this.store.select<ObjectCacheEntry>('core', 'cache', 'object', uuid)
      .filter(entry => this.isValid(entry))
      .map((entry: ObjectCacheEntry) => <T> entry.data);
  }

  getList<T extends CacheableObject>(uuids: Array<string>): Observable<Array<T>> {
    return Observable.combineLatest(
      uuids.map((id: string) => this.get<T>(id))
    );
  }

  has(uuid: string): boolean {
    let result: boolean;

    this.store.select<ObjectCacheEntry>('core', 'cache', 'object', uuid)
      .take(1)
      .subscribe(entry => result = this.isValid(entry));

    return result;
  }

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
