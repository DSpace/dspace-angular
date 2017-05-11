import { combineReducers } from "@ngrx/store";
import { CacheState, cacheReducer } from "./cache/cache.reducers";
import { IndexState, indexReducer } from "./index/index.reducers";
import { DataState, dataReducer } from "./data/data.reducers";

export interface CoreState {
  cache: CacheState,
  index: IndexState,
  data: DataState
}

export const reducers = {
  cache: cacheReducer,
  index: indexReducer,
  data: dataReducer
};

export function coreReducer(state: any, action: any) {
  return combineReducers(reducers)(state, action);
}
