import { combineReducers } from "@ngrx/store";
import { RequestCacheState, requestCacheReducer } from "./request-cache.reducer";
import { ObjectCacheState, objectCacheReducer } from "./object-cache.reducer";

export interface CacheState {
  request: RequestCacheState,
  object: ObjectCacheState
}

export const reducers = {
  request: requestCacheReducer,
  object: objectCacheReducer
};

export function cacheReducer(state: any, action: any) {
  return combineReducers(reducers)(state, action);
}
