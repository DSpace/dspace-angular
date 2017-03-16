import { combineReducers } from "@ngrx/store";
import { CacheState, cacheReducer } from "./cache/cache.reducers";

export interface CoreState {
  cache: CacheState
}

export const reducers = {
  cache: cacheReducer
};

export function coreReducer(state: any, action: any) {
  return combineReducers(reducers)(state, action);
}
