import { combineReducers } from "@ngrx/store";
import { RequestState, requestReducer } from "./request.reducer";

export interface DataState {
  request: RequestState
}

export const reducers = {
  request: requestReducer
};

export function dataReducer(state: any, action: any) {
  return combineReducers(reducers)(state, action);
}
