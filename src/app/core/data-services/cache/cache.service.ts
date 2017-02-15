import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { CacheState, CacheEntry, CacheableObject } from "./cache.reducer";
import { AddToCacheAction, RemoveFromCacheAction } from "./cache.actions";
import { Observable } from "rxjs";
import { hasNoValue } from "../../../shared/empty.util";

@Injectable()
export class CacheService {
  constructor(
    private store: Store<CacheState>
  ) {}

  add(objectToCache: CacheableObject, msToLive: number): void {
    this.store.dispatch(new AddToCacheAction(objectToCache, msToLive));
  }

  remove(uuid: string): void {
    this.store.dispatch(new RemoveFromCacheAction(uuid));
  }

  get<T extends CacheableObject>(uuid: string): Observable<T> {
    return this.store.select<CacheEntry>('core', 'cache', uuid)
      .filter(entry => this.isValid(entry))
      .map((entry: CacheEntry) => <T> entry.data);
  }

  getList<T extends CacheableObject>(uuids: Array<string>): Observable<Array<T>> {
    return Observable.combineLatest(
      uuids.map((id: string) => this.get<T>(id))
    );
  }

  has(uuid: string): boolean {
    let result: boolean;

    this.store.select<CacheEntry>('core', 'cache', uuid)
      .take(1)
      .subscribe(entry => result = this.isValid(entry));

    return result;
  }

  private isValid(entry: CacheEntry): boolean {
    if (hasNoValue(entry)) {
      return false;
    }
    else {
      const timeOutdated = entry.timeAdded + entry.msToLive;
      const isOutDated = new Date().getTime() > timeOutdated;
      if (isOutDated) {
        this.store.dispatch(new RemoveFromCacheAction(entry.data.uuid));
      }
      return !isOutDated;
    }
  }

}
