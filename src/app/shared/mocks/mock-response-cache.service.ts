import { Observable } from 'rxjs/Observable';
import { ResponseCacheEntry } from '../../core/cache/response-cache.reducer';
import { ResponseCacheService } from '../../core/cache/response-cache.service';

export function getMockResponseCacheService(
  add$: Observable<ResponseCacheEntry> = Observable.of(new ResponseCacheEntry()),
  get$: Observable<ResponseCacheEntry> = Observable.of(new ResponseCacheEntry()),
  has: boolean = false
): ResponseCacheService {
  return jasmine.createSpyObj('ResponseCacheService', {
    add: add$,
    get: get$,
    has,
  });

}
