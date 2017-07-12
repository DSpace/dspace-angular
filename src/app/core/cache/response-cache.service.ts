import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import {
  ResponseCacheState, ResponseCacheEntry
} from "./response-cache.reducer";
import { Observable } from "rxjs";
import { hasNoValue } from "../../shared/empty.util";
import {
  ResponseCacheRemoveAction,
  ResponseCacheAddAction
} from "./response-cache.actions";
import { Response } from "./response-cache.models";

/**
 * A service to interact with the response cache
 */
@Injectable()
export class ResponseCacheService {
  constructor(
    private store: Store<ResponseCacheState>
  ) { }

  add(key: string, response: Response, msToLive: number): Observable<ResponseCacheEntry> {
    if (!this.has(key)) {
      // this.store.dispatch(new ResponseCacheFindAllAction(key, service, scopeID, paginationOptions, sortOptions));
      this.store.dispatch(new ResponseCacheAddAction(key, response, new Date().getTime(), msToLive));
    }
    return this.get(key);
  }

  /**
   * Get an observable of the response with the specified key
   *
   * @param key
   *    the key of the response to get
   * @return Observable<ResponseCacheEntry>
   *    an observable of the ResponseCacheEntry with the specified key
   */
  get(key: string): Observable<ResponseCacheEntry> {
    return this.store.select<ResponseCacheEntry>('core', 'cache', 'response', key)
      .filter(entry => this.isValid(entry))
      .distinctUntilChanged()
  }

  /**
   * Check whether the response with the specified key is cached
   *
   * @param key
   *    the key of the response to check
   * @return boolean
   *    true if the response with the specified key is cached,
   *    false otherwise
   */
  has(key: string): boolean {
    let result: boolean;

    this.store.select<ResponseCacheEntry>('core', 'cache', 'response', key)
      .take(1)
      .subscribe(entry => {
        result = this.isValid(entry);
      });

    return result;
  }

  /**
   * Check whether a ResponseCacheEntry should still be cached
   *
   * @param entry
   *    the entry to check
   * @return boolean
   *    false if the entry is null, undefined, or its time to
   *    live has been exceeded, true otherwise
   */
  private isValid(entry: ResponseCacheEntry): boolean {
    if (hasNoValue(entry)) {
      return false;
    }
    else {
      const timeOutdated = entry.timeAdded + entry.msToLive;
      const isOutDated = new Date().getTime() > timeOutdated;
      if (isOutDated) {
        this.store.dispatch(new ResponseCacheRemoveAction(entry.key));
      }
      return !isOutDated;
    }
  }

}
