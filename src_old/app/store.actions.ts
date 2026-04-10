import { Action } from '@ngrx/store';

import { AppState } from './app.reducer';

export class StoreAction implements Action {
  type: string;
  payload: AppState | Action[];
  // eslint-disable-next-line @typescript-eslint/no-shadow
  constructor(type: string, payload: AppState | Action[]) {
    this.type = type;
    this.payload = payload;
  }
}
