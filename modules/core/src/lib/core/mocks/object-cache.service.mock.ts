import { ObjectCacheService } from '../cache';

export function getMockObjectCacheService(): ObjectCacheService {
  return jasmine.createSpyObj('objectCacheService', [
    'add',
    'remove',
    'getByUUID',
    'getByHref',
    'getObjectByHref',
    'getRequestHrefBySelfLink',
    'getRequestHrefByUUID',
    'getList',
    'hasByUUID',
    'hasByHref',
    'getRequestUUIDBySelfLink',
    'addDependency',
    'removeDependents',
  ]);

}
