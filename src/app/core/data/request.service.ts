import { Injectable } from '@angular/core';

import { MemoizedSelector, Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { hasValue } from '../../shared/empty.util';
import { CacheableObject } from '../cache/object-cache.reducer';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSOSuccessResponse, RestResponse } from '../cache/response-cache.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { ResponseCacheService } from '../cache/response-cache.service';
import { CoreState } from '../core.reducers';
import { keySelector } from '../shared/selectors';
import { RequestConfigureAction, RequestExecuteAction } from './request.actions';
import { RestRequest } from './request.models';

import { RequestEntry } from './request.reducer';

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

  configure<T extends CacheableObject>(request: RestRequest): void {
    let isCached = this.objectCache.hasBySelfLink(request.href);
    // console.log('request.href', request.href);
    if (!isCached && this.responseCache.has(request.href)) {
      const [successResponse, errorResponse] = this.responseCache.get(request.href)
        .take(1)
        .map((entry: ResponseCacheEntry) => entry.response)
        .share()
        .partition((response: RestResponse) => response.isSuccessful);

      const [dsoSuccessResponse, otherSuccessResponse] = successResponse
        .share()
        .partition((response: DSOSuccessResponse) => hasValue(response.resourceSelfLinks));

      Observable.merge(
        errorResponse.map(() => true), // TODO add a configurable number of retries in case of an error.
        otherSuccessResponse.map(() => true),
        dsoSuccessResponse // a DSOSuccessResponse should only be considered cached if all its resources are cached
          .map((response: DSOSuccessResponse) => response.resourceSelfLinks)
          .map((resourceSelfLinks: string[]) => resourceSelfLinks
            .every((selfLink) => this.objectCache.hasBySelfLink(selfLink))
          )
      ).subscribe((c) => isCached = c);
    }

    const isPending = this.isPending(request.href);

    if (!(isCached || isPending)) {
      this.store.dispatch(new RequestConfigureAction(request));
      this.store.dispatch(new RequestExecuteAction(request.href));
    }
  }
}
