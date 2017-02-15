import { combineReducers } from "@ngrx/store";
import {
  CollectionDataState,
  collectionDataReducer
} from "./data-services/collection/collection-data.reducer";
import { CacheState, cacheReducer } from "./data-services/cache/cache.reducer";

export interface CoreState {
  collectionData: CollectionDataState,
  cache: CacheState
}

export const reducers = {
  collectionData: collectionDataReducer,
  cache: cacheReducer
};

export function coreReducer(state: any, action: any) {
  return combineReducers(reducers)(state, action);
}
