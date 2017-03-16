import { type } from "./shared/ngrx/type";
import { Action } from "@ngrx/store";
import { AppState } from "./app.reducers";

export const StoreActionTypes = {
  REHYDRATE: type('dspace/ngrx/rehydrate')
};

export class RehydrateStoreAction implements Action {
  type = StoreActionTypes.REHYDRATE;

  constructor(public payload: AppState) {}
}

export type StoreAction
  = RehydrateStoreAction;
