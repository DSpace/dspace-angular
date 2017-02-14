import { combineReducers } from "@ngrx/store";
import { CollectionFindMultipleState, findMultipleReducer } from "./collection-find-multiple.reducer";
import { CollectionFindSingleState, findSingleReducer } from "./collection-find-single.reducer";

export interface CollectionDataState {
  findMultiple: CollectionFindMultipleState,
  findSingle: CollectionFindSingleState
}

const reducers = {
  findMultiple: findMultipleReducer,
  findSingle: findSingleReducer
};

export function collectionDataReducer(state: any, action: any) {
  return combineReducers(reducers)(state, action);
}
