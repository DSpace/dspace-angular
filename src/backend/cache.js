var _fakeLRUcount = 0;
export var fakeDemoRedisCache = {
    _cache: {},
    get: function (key) {
        var cache = fakeDemoRedisCache._cache[key];
        _fakeLRUcount++;
        if (_fakeLRUcount >= 10) {
            fakeDemoRedisCache.clear();
            _fakeLRUcount = 0;
        }
        return cache;
    },
    set: function (key, data) { return fakeDemoRedisCache._cache[key] = data; },
    clear: function () { return fakeDemoRedisCache._cache = {}; }
};
//# sourceMappingURL=cache.js.map