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
import { GenericConstructor } from "../shared/generic-constructor";

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

  configure<T extends CacheableObject>(href: string, normalizedType: GenericConstructor<T>): void {
    const isCached = this.objectCache.hasBySelfLink(href);
    const isPending = this.isPending(href);

    if (!(isCached || isPending)) {
      const request = new Request(href, normalizedType);
      this.store.dispatch(new RequestConfigureAction(request));
      this.store.dispatch(new RequestExecuteAction(href));
    }
  }
}
