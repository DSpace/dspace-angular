import { combineReducers } from '@ngrx/store';

import { ResponseCacheState, responseCacheReducer } from './response-cache.reducer';
import { ObjectCacheState, objectCacheReducer } from './object-cache.reducer';

export interface CacheState {
  response: ResponseCacheState,
  object: ObjectCacheState
}

export const reducers = {
  response: responseCacheReducer,
  object: objectCacheReducer
};

export function cacheReducer(state: any, action: any) {
  return combineReducers(reducers)(state, action);
}
