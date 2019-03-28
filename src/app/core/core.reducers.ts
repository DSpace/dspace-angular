import {
  ActionReducerMap,
  createFeatureSelector,
} from '@ngrx/store';

import { objectCacheReducer, ObjectCacheState } from './cache/object-cache.reducer';
import { indexReducer, IndexState } from './index/index.reducer';
import { requestReducer, RequestState } from './data/request.reducer';
import { authReducer, AuthState } from './auth/auth.reducer';
import { serverSyncBufferReducer, ServerSyncBufferState } from './cache/server-sync-buffer.reducer';
import {
  objectUpdatesReducer,
  ObjectUpdatesState
} from './data/object-updates/object-updates.reducer';

export interface CoreState {
  'cache/object': ObjectCacheState,
  'cache/syncbuffer': ServerSyncBufferState,
  'cache/object-updates': ObjectUpdatesState
  'data/request': RequestState,
  'index': IndexState,
  'auth': AuthState,
}

export const coreReducers: ActionReducerMap<CoreState> = {
  'cache/object': objectCacheReducer,
  'cache/syncbuffer': serverSyncBufferReducer,
  'cache/object-updates': objectUpdatesReducer,
  'data/request': requestReducer,
  'index': indexReducer,
  'auth': authReducer,
};

export const coreSelector = createFeatureSelector<CoreState>('core');
