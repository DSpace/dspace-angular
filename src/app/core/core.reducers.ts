import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import { responseCacheReducer, ResponseCacheState } from './cache/response-cache.reducer';
import { objectCacheReducer, ObjectCacheState } from './cache/object-cache.reducer';
import { indexReducer, IndexState } from './index/index.reducer';
import { requestReducer, RequestState } from './data/request.reducer';
import { authReducer, AuthState } from './auth/auth.reducers';
import { jsonPatchOperationsReducer, JsonPatchOperationsState } from './json-patch/json-patch-operations.reducer';

export interface CoreState {
  'data/object': ObjectCacheState,
  'data/response': ResponseCacheState,
  'data/request': RequestState,
  'index': IndexState,
  'auth': AuthState,
  'json/patch': JsonPatchOperationsState
}

export const coreReducers: ActionReducerMap<CoreState> = {
  'data/object': objectCacheReducer,
  'data/response': responseCacheReducer,
  'data/request': requestReducer,
  'index': indexReducer,
  'auth': authReducer
  'json/patch': jsonPatchOperationsReducer
};

export const coreSelector = createFeatureSelector<CoreState>('core');
