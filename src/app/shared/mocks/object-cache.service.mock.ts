import { ObjectCacheService } from '../../core/cache/object-cache.service';

export function getMockObjectCacheService(): ObjectCacheService {
  return jasmine.createSpyObj('objectCacheService', [
    'add',
    'remove',
    'getByUUID',
    'getBySelfLink',
    'getRequestHrefBySelfLink',
    'getRequestHrefByUUID',
    'getList',
    'hasByUUID',
    'hasBySelfLink'
  ]);

}
