import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { CacheableObject } from '../../core/cache/cacheable-object.model';
import { ObjectCacheEntry } from '../../core/cache/object-cache.reducer';

/* eslint-disable @typescript-eslint/no-empty-function */
/**
 * Stub class of {@link ObjectCacheService}
 */
export class ObjectCacheServiceStub {

  add(_object: CacheableObject, _msToLive: number, _requestUUID: string, _alternativeLink?: string): void {
  }

  remove(_href: string): void {
  }

  getByHref(_href: string): Observable<ObjectCacheEntry> {
    return observableOf(undefined);
  }

  hasByHref$(_href: string): Observable<boolean> {
    return observableOf(false);
  }

  addDependency(_href$: string | Observable<string>, _dependsOnHref$: string | Observable<string>): void {
  }

  removeDependents(_href: string): void {
  }

}
