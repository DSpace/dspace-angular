import { combineReducers } from "@ngrx/store";
import { CacheState, cacheReducer } from "./data-services/cache/cache.reducer";
import { dataReducer, DataState } from "./data-services/data.reducer";

export interface CoreState {
  data: DataState,
  cache: CacheState
}

export const reducers = {
  data: dataReducer,
  cache: cacheReducer
};

export function coreReducer(state: any, action: any) {
  return combineReducers(reducers)(state, action);
}
