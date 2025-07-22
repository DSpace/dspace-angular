import { Action } from '@ngrx/store';

import { CoreState } from './core-state.model';
import { type } from './shared';

export const StoreActionTypes = {
  REHYDRATE: type('dspace/ngrx/REHYDRATE'),
  REPLAY: type('dspace/ngrx/REPLAY'),
};

export class StoreAction implements Action {
  type: string;
  payload: CoreState | Action[];
  // eslint-disable-next-line @typescript-eslint/no-shadow
  constructor(type: string, payload: CoreState | Action[]) {
    this.type = type;
    this.payload = payload;
  }
}
