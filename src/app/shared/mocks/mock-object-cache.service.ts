import { ObjectCacheService } from '../../core/cache/object-cache.service';

export function getMockObjectCacheService(): ObjectCacheService {
  return jasmine.createSpyObj('objectCacheService', [
    'add',
    'remove',
    'getByID',
    'getBySelfLink',
    'getRequestHrefBySelfLink',
    'getRequestHrefByUUID',
    'getList',
    'hasById',
    'hasBySelfLink'
  ]);

}
