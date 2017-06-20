import { Injectable } from "@angular/core";
import { RequestEntry, RequestState } from "./request.reducer";
import { Store } from "@ngrx/store";
import { Request } from "./request.models";
import { hasValue } from "../../shared/empty.util";
import { Observable } from "rxjs/Observable";
import { RequestConfigureAction, RequestExecuteAction } from "./request.actions";
import { ResponseCacheService } from "../cache/response-cache.service";
import { ObjectCacheService } from "../cache/object-cache.service";
import { CacheableObject } from "../cache/object-cache.reducer";
import { ResponseCacheEntry } from "../cache/response-cache.reducer";
import { request } from "http";
import { SuccessResponse } from "../cache/response-cache.models";

@Injectable()
export class RequestService {

  constructor(
    private objectCache: ObjectCacheService,
    private responseCache: ResponseCacheService,
    private store: Store<RequestState>
  ) {
  }

  isPending(href: string): boolean {
    let isPending = false;
    this.store.select<RequestEntry>('core', 'data', 'request', href)
      .take(1)
      .subscribe((re: RequestEntry) =>  {
        isPending = (hasValue(re) && !re.completed)
    });

    return isPending;
  }

  get(href: string): Observable<RequestEntry> {
    return this.store.select<RequestEntry>('core', 'data', 'request', href);
  }

  configure<T extends CacheableObject>(request: Request<T>): void {
    let isCached = this.objectCache.hasBySelfLink(request.href);

    if (!isCached && this.responseCache.has(request.href)) {
      //if it isn't cached it may be a list endpoint, if so verify
      //every object included in the response is still cached
      this.responseCache.get(request.href)
        .take(1)
        .filter((entry: ResponseCacheEntry) => entry.response.isSuccessful)
        .map((entry: ResponseCacheEntry) => (<SuccessResponse> entry.response).resourceUUIDs)
        .map((resourceUUIDs: Array<string>) => resourceUUIDs.every(uuid => this.objectCache.has(uuid)))
        .subscribe(c => isCached = c);
    }

    const isPending = this.isPending(request.href);

    if (!(isCached || isPending)) {
      this.store.dispatch(new RequestConfigureAction(request));
      this.store.dispatch(new RequestExecuteAction(request.href));
    }
  }
}
