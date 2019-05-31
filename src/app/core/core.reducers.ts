import {
  ActionReducerMap,
  createFeatureSelector,
} from '@ngrx/store';

import { objectCacheReducer, ObjectCacheState } from './cache/object-cache.reducer';
import { indexReducer, MetaIndexState } from './index/index.reducer';
import { requestReducer, RequestState } from './data/request.reducer';
import { authReducer, AuthState } from './auth/auth.reducer';
import { jsonPatchOperationsReducer, JsonPatchOperationsState } from './json-patch/json-patch-operations.reducer';
import { serverSyncBufferReducer, ServerSyncBufferState } from './cache/server-sync-buffer.reducer';
import {
  objectUpdatesReducer,
  ObjectUpdatesState
} from './data/object-updates/object-updates.reducer';
import { routeReducer, RouteState } from '../shared/services/route.reducer';

export interface CoreState {
  'cache/object': ObjectCacheState,
  'cache/syncbuffer': ServerSyncBufferState,
  'cache/object-updates': ObjectUpdatesState
  'data/request': RequestState,
  'index': MetaIndexState,
  'auth': AuthState,
  'json/patch': JsonPatchOperationsState,
  'route': RouteState
}

export const coreReducers: ActionReducerMap<CoreState> = {
  'cache/object': objectCacheReducer,
  'cache/syncbuffer': serverSyncBufferReducer,
  'cache/object-updates': objectUpdatesReducer,
  'data/request': requestReducer,
  'index': indexReducer,
  'auth': authReducer,
  'json/patch': jsonPatchOperationsReducer,
  'route': routeReducer
};
