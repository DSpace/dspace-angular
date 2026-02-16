import { correlationIdReducer } from '@dspace/core/correlation-id/correlation-id.reducer';
import { ActionReducerMap } from '@ngrx/store';

import { authReducer } from './auth/auth.reducer';
import { objectCacheReducer } from './cache/object-cache.reducer';
import { serverSyncBufferReducer } from './cache/server-sync-buffer.reducer';
import { CoreState } from './core-state.model';
import { objectUpdatesReducer } from './data/object-updates/object-updates.reducer';
import { requestReducer } from './data/request.reducer';
import { historyReducer } from './history/history.reducer';
import { indexReducer } from './index/index.reducer';
import { jsonPatchOperationsReducer } from './json-patch/json-patch-operations.reducer';
import { metaTagReducer } from './metadata/meta-tag.reducer';
import { notificationsReducer } from './notification-system/notifications.reducers';
import { routeReducer } from './services/route.reducer';

export const coreReducers: ActionReducerMap<CoreState> = {
  'cache/object': objectCacheReducer,
  'cache/syncbuffer': serverSyncBufferReducer,
  'cache/object-updates': objectUpdatesReducer,
  'data/request': requestReducer,
  'history': historyReducer,
  'index': indexReducer,
  'auth': authReducer,
  'json/patch': jsonPatchOperationsReducer,
  'metaTag': metaTagReducer,
  'route': routeReducer,
  'correlationId': correlationIdReducer,
  'notifications': notificationsReducer,
};
