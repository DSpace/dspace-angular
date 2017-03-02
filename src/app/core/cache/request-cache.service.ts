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

@Injectable()
export class RequestCacheService {
  constructor(
    private store: Store<RequestCacheState>
  ) {}

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

  get(key: string): Observable<RequestCacheEntry> {
    return this.store.select<RequestCacheEntry>('core', 'cache', 'request', key)
      .filter(entry => this.isValid(entry))
      .distinctUntilChanged()
  }

  has(key: string): boolean {
    let result: boolean;

    this.store.select<RequestCacheEntry>('core', 'cache', 'request', key)
      .take(1)
      .subscribe(entry => result = this.isValid(entry));

    return result;
  }

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
