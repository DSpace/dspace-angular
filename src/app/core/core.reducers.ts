import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import { objectCacheReducer, ObjectCacheState } from './cache/object-cache.reducer';
import { indexReducer, IndexState } from './index/index.reducer';
import { requestReducer, RequestState } from './data/request.reducer';
import { authReducer, AuthState } from './auth/auth.reducer';
import { jsonPatchOperationsReducer, JsonPatchOperationsState } from './json-patch/json-patch-operations.reducer';
import { serverSyncBufferReducer, ServerSyncBufferState } from './cache/server-sync-buffer.reducer';

export interface CoreState {
  'cache/object': ObjectCacheState,
  'cache/syncbuffer': ServerSyncBufferState,
  'data/request': RequestState,
  'index': IndexState,
  'auth': AuthState,
  'json/patch': JsonPatchOperationsState
}

export const coreReducers: ActionReducerMap<CoreState> = {
  'cache/object': objectCacheReducer,
  'cache/syncbuffer': serverSyncBufferReducer,
  'data/request': requestReducer,
  'index': indexReducer,
  'auth': authReducer,
  'json/patch': jsonPatchOperationsReducer
};

export const coreSelector = createFeatureSelector<CoreState>('core');
