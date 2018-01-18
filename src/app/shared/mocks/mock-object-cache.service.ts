import { ObjectCacheService } from '../../core/cache/object-cache.service';

export function initMockObjectCacheService(): ObjectCacheService {
  return jasmine.createSpyObj('objectCacheService', {
    hasBySelfLink: true,
  });
}
