import { Injectable } from '@angular/core';
import { MemoizedSelector, Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';

import { ResponseCacheEntry } from './response-cache.reducer';
import { hasNoValue } from '../../shared/empty.util';
import { ResponseCacheRemoveAction, ResponseCacheAddAction } from './response-cache.actions';
import { Response } from './response-cache.models';
import { CoreState } from '../core.reducers';
import { keySelector } from '../shared/selectors';

function entryFromKeySelector(key: string): MemoizedSelector<CoreState, ResponseCacheEntry> {
  return keySelector<ResponseCacheEntry>('data/response', key);
}

/**
 * A service to interact with the response cache
 */
@Injectable()
export class ResponseCacheService {
  constructor(
    private store: Store<CoreState>
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
    return this.store.select(entryFromKeySelector(key))
      .filter((entry: ResponseCacheEntry) => this.isValid(entry))
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

    this.store.select(entryFromKeySelector(key))
      .take(1)
      .subscribe((entry: ResponseCacheEntry) => {
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
    } else {
      const timeOutdated = entry.timeAdded + entry.msToLive;
      const isOutDated = new Date().getTime() > timeOutdated;
      if (isOutDated) {
        this.store.dispatch(new ResponseCacheRemoveAction(entry.key));
      }
      return !isOutDated;
    }
  }

}
