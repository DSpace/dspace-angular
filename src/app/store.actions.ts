import { type } from './shared/ngrx/type';
import { Action } from '@ngrx/store';
import { AppState } from './app.reducer';

export const StoreActionTypes = {
  REHYDRATE: type('dspace/ngrx/REHYDRATE'),
  REPLAY: type('dspace/ngrx/REPLAY'),
};

export class StoreAction implements Action {
  type: string;
  payload: AppState | Action[];
  // tslint:disable-next-line:no-shadowed-variable
  constructor(type: string, payload: AppState | Action[]) {
    this.type = type;
    this.payload = payload;
  }
}
