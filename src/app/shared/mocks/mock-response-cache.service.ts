import { ResponseCacheService } from '../../core/cache/response-cache.service';
import { ResponseCacheEntry } from '../../core/cache/response-cache.reducer';
import { RestResponse } from '../../core/cache/response-cache.models';

export function getMockResponseCacheService(): ResponseCacheService {
  return jasmine.createSpyObj('ResponseCacheService', {
    add: (key: string, response: RestResponse, msToLive: number) => new ResponseCacheEntry(),
    get: (key: string) => new ResponseCacheEntry(),
    has: (key: string) => false,
  });

}
