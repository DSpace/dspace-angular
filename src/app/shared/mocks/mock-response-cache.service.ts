import {of as observableOf,  Observable } from 'rxjs';
import { ResponseCacheEntry } from '../../core/cache/response-cache.reducer';
import { ResponseCacheService } from '../../core/cache/response-cache.service';

export function getMockResponseCacheService(
  add$: Observable<ResponseCacheEntry> = observableOf(new ResponseCacheEntry()),
  get$: Observable<ResponseCacheEntry> = observableOf(new ResponseCacheEntry()),
  remove$: Observable<ResponseCacheEntry> = observableOf(new ResponseCacheEntry()),
  has: boolean = false
): ResponseCacheService {
  return jasmine.createSpyObj('ResponseCacheService', {
    add: add$,
    get: get$,
    remove: remove$,
    has,
  });

}
