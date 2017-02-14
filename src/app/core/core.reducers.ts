import { combineReducers } from "@ngrx/store";
import {
  CollectionDataState,
  collectionDataReducer
} from "./data-services/collection/collection-data.reducer";

export interface CoreState {
  collectionData: CollectionDataState
}

export const reducers = {
  collectionData: collectionDataReducer,
};

export function coreReducer(state: any, action: any) {
  return combineReducers(reducers)(state, action);
}
