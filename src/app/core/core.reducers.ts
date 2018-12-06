import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import { authReducer, AuthState } from './auth/auth.reducer';
import { objectCacheReducer, ObjectCacheState } from './cache/object-cache.reducer';
import { responseCacheReducer, ResponseCacheState } from './cache/response-cache.reducer';
import { requestReducer, RequestState } from './data/request.reducer';
import { indexReducer, IndexState } from './index/index.reducer';

export interface CoreState {
  'data/object': ObjectCacheState,
  'data/response': ResponseCacheState,
  'data/request': RequestState,
  'index': IndexState,
  'auth': AuthState,
}

export const coreReducers: ActionReducerMap<CoreState> = {
  'data/object': objectCacheReducer,
  'data/response': responseCacheReducer,
  'data/request': requestReducer,
  'index': indexReducer,
  'auth': authReducer
};

export const coreSelector = createFeatureSelector<CoreState>('core');
