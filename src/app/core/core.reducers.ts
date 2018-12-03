import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import { responseCacheReducer, ResponseCacheState } from './cache/response-cache.reducer';
import { objectCacheReducer, ObjectCacheState } from './cache/object-cache.reducer';
import { indexReducer, IndexState } from './index/index.reducer';
import { requestReducer, RequestState } from './data/request.reducer';
import { authReducer, AuthState } from './auth/auth.reducer';
import { serverSyncBufferReducer, ServerSyncBufferState } from './cache/server-sync-buffer.reducer';

export interface CoreState {
  'cache/object': ObjectCacheState,
  'cache/response': ResponseCacheState,
  'cache/syncbuffer': ServerSyncBufferState,
  'data/request': RequestState,
  'index': IndexState,
  'auth': AuthState,
}

export const coreReducers: ActionReducerMap<CoreState> = {
  'cache/object': objectCacheReducer,
  'cache/response': responseCacheReducer,
  'cache/syncbuffer': serverSyncBufferReducer,
  'data/request': requestReducer,
  'index': indexReducer,
  'auth': authReducer
};

export const coreSelector = createFeatureSelector<CoreState>('core');
