import { combineReducers } from "@ngrx/store";
import {
  CollectionDataState,
  collectionDataReducer
} from "./data-services/collection/collection-data.reducer";
import { CacheState, cacheReducer } from "./data-services/cache/cache.reducer";
import { ItemDataState, itemDataReducer } from "./data-services/item/item-data.reducer";

export interface CoreState {
  collectionData: CollectionDataState,
  itemData: ItemDataState,
  cache: CacheState
}

export const reducers = {
  collectionData: collectionDataReducer,
  itemData: itemDataReducer,
  cache: cacheReducer
};

export function coreReducer(state: any, action: any) {
  return combineReducers(reducers)(state, action);
}
