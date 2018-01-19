import { ResponseCacheService } from '../../core/cache/response-cache.service';

export function getMockResponseCacheService(): ResponseCacheService {
  return jasmine.createSpyObj('ResponseCacheService', [
    'add',
    'get',
    'has',
  ]);

}
