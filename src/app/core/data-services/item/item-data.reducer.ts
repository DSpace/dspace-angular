import { combineReducers } from "@ngrx/store";
import { ItemFindMultipleState, findMultipleReducer } from "./item-find-multiple.reducer";
import { ItemFindSingleState, findSingleReducer } from "./item-find-single.reducer";

export interface ItemDataState {
  findMultiple: ItemFindMultipleState,
  findSingle: ItemFindSingleState
}

const reducers = {
  findMultiple: findMultipleReducer,
  findSingle: findSingleReducer
};

export function itemDataReducer(state: any, action: any) {
  return combineReducers(reducers)(state, action);
}
