import { Injectable, OpaqueToken } from "@angular/core";
import { Store } from "@ngrx/store";
import { RequestCacheState, RequestCacheEntry } from "./request-cache.reducer";
import { Observable } from "rxjs";
import { hasNoValue } from "../../shared/empty.util";
import {
  RequestCacheRemoveAction, RequestCacheFindAllAction,
  RequestCacheFindByIDAction
} from "./request-cache.actions";
import { SortOptions } from "../shared/sort-options.model";
import { PaginationOptions } from "../shared/pagination-options.model";

/**
 * A service to interact with the request cache
 */
@Injectable()
export class RequestCacheService {
  constructor(
    private store: Store<RequestCacheState>
  ) {}

  /**
   * Start a new findAll request
   *
   * This will send a new findAll request to the backend,
   * and store the request parameters and the fact that
   * the request is pending
   *
   * @param key
   *    the key should be a unique identifier for the request and its parameters
   * @param service
   *    the service that initiated the request
   * @param scopeID
   *    the id of an optional scope object
   * @param paginationOptions
   *    the pagination options (optional)
   * @param sortOptions
   *    the sort options (optional)
   * @return Observable<RequestCacheEntry>
   *    an observable of the RequestCacheEntry for this request
   */
  findAll(
    key: string,
    service: OpaqueToken,
    scopeID?: string,
    paginationOptions?: PaginationOptions,
    sortOptions?: SortOptions
  ): Observable<RequestCacheEntry> {
      if (!this.has(key)) {
        this.store.dispatch(new RequestCacheFindAllAction(key, service, scopeID, paginationOptions, sortOptions));
      }
    return this.get(key);
  }

  /**
   * Start a new findById request
   *
   * This will send a new findById request to the backend,
   * and store the request parameters and the fact that
   * the request is pending
   *
   * @param key
   *    the key should be a unique identifier for the request and its parameters
   * @param service
   *    the service that initiated the request
   * @param resourceID
   *    the ID of the resource to find
   * @return Observable<RequestCacheEntry>
   *    an observable of the RequestCacheEntry for this request
   */
  findById(
    key: string,
    service: OpaqueToken,
    resourceID: string
  ): Observable<RequestCacheEntry> {
    if (!this.has(key)) {
      this.store.dispatch(new RequestCacheFindByIDAction(key, service, resourceID));
    }
    return this.get(key);
  }

  /**
   * Get an observable of the request with the specified key
   *
   * @param key
   *    the key of the request to get
   * @return Observable<RequestCacheEntry>
   *    an observable of the RequestCacheEntry with the specified key
   */
  get(key: string): Observable<RequestCacheEntry> {
    return this.store.select<RequestCacheEntry>('core', 'cache', 'request', key)
      .filter(entry => this.isValid(entry))
      .distinctUntilChanged()
  }

  /**
   * Check whether the request with the specified key is cached
   *
   * @param key
   *    the key of the request to check
   * @return boolean
   *    true if the request with the specified key is cached,
   *    false otherwise
   */
  has(key: string): boolean {
    let result: boolean;

    this.store.select<RequestCacheEntry>('core', 'cache', 'request', key)
      .take(1)
      .subscribe(entry => result = this.isValid(entry));

    return result;
  }

  /**
   * Check whether a RequestCacheEntry should still be cached
   *
   * @param entry
   *    the entry to check
   * @return boolean
   *    false if the entry is null, undefined, or its time to
   *    live has been exceeded, true otherwise
   */
  private isValid(entry: RequestCacheEntry): boolean {
    if (hasNoValue(entry)) {
      return false;
    }
    else {
      const timeOutdated = entry.timeAdded + entry.msToLive;
      const isOutDated = new Date().getTime() > timeOutdated;
      if (isOutDated) {
        this.store.dispatch(new RequestCacheRemoveAction(entry.key));
      }
      return !isOutDated;
    }
  }

}
