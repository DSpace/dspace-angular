import { objectCacheReducer } from './cache/object-cache.reducer';
import { indexReducer } from './index/index.reducer';
import { requestReducer } from './data/request.reducer';
import { authReducer } from './auth/auth.reducer';
import { jsonPatchOperationsReducer } from './json-patch/json-patch-operations.reducer';
import { serverSyncBufferReducer } from './cache/server-sync-buffer.reducer';
import { objectUpdatesReducer } from './data/object-updates/object-updates.reducer';
export var coreReducers = {
    'cache/object': objectCacheReducer,
    'cache/syncbuffer': serverSyncBufferReducer,
    'cache/object-updates': objectUpdatesReducer,
    'data/request': requestReducer,
    'index': indexReducer,
    'auth': authReducer,
    'json/patch': jsonPatchOperationsReducer
};
//# sourceMappingURL=core.reducers.js.map