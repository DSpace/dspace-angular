export function getMockObjectCacheService() {
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
//# sourceMappingURL=mock-object-cache.service.js.map