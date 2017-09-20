import { Injectable } from '@angular/core';

import { MemoizedSelector, Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';

import { RequestEntry } from './request.reducer';
import { Request } from './request.models';
import { hasValue } from '../../shared/empty.util';
import { RequestConfigureAction, RequestExecuteAction } from './request.actions';
import { ResponseCacheService } from '../cache/response-cache.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CacheableObject } from '../cache/object-cache.reducer';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { SuccessResponse } from '../cache/response-cache.models';
import { CoreState } from '../core.reducers';
import { keySelector } from '../shared/selectors';

function entryFromHrefSelector(href: string): MemoizedSelector<CoreState, RequestEntry> {
  return keySelector<RequestEntry>('data/request', href);
}

@Injectable()
export class RequestService {

  constructor(
    private objectCache: ObjectCacheService,
    private responseCache: ResponseCacheService,
    private store: Store<CoreState>
  ) {
  }

  isPending(href: string): boolean {
    let isPending = false;
    this.store.select(entryFromHrefSelector(href))
      .take(1)
      .subscribe((re: RequestEntry) => {
        isPending = (hasValue(re) && !re.completed)
      });

    return isPending;
  }

  get(href: string): Observable<RequestEntry> {
    return this.store.select(entryFromHrefSelector(href));
  }

  configure<T extends CacheableObject>(request: Request<T>): void {
    let isCached = this.objectCache.hasBySelfLink(request.href);

    if (!isCached && this.responseCache.has(request.href)) {
      // if it isn't cached it may be a list endpoint, if so verify
      // every object included in the response is still cached
      this.responseCache.get(request.href)
        .take(1)
        .filter((entry: ResponseCacheEntry) => entry.response.isSuccessful)
        .map((entry: ResponseCacheEntry) => (entry.response as SuccessResponse).resourceUUIDs)
        .map((resourceUUIDs: string[]) => resourceUUIDs.every((uuid) => this.objectCache.has(uuid)))
        .subscribe((c) => isCached = c);
    }

    const isPending = this.isPending(request.href);

    if (!(isCached || isPending)) {
      this.store.dispatch(new RequestConfigureAction(request));
      this.store.dispatch(new RequestExecuteAction(request.href));
    }
  }
}
