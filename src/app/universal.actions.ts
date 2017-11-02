import { type } from './shared/ngrx/type';
import { Action } from '@ngrx/store';
import { AppState } from './app.reducer';

export const UniversalActionTypes = {
  REHYDRATE: type('dspace/universal/REHYDRATE'),
  REPLAY: type('dspace/universal/REPLAY'),
  REPLAY_COMPLETE: type('dspace/universal/REPLAY_COMPLETE')
};

/* tslint:disable:max-classes-per-file */
export class UniversalRehydrateAction implements Action {
  type = UniversalActionTypes.REHYDRATE;

  constructor(public payload: AppState) {
  }
}

export class UniversalReplayAction implements Action {
  type = UniversalActionTypes.REPLAY;

  constructor(public payload: Action[]) {
  }
}
export class UniversalReplayCompleteAction implements Action {
  type = UniversalActionTypes.REPLAY_COMPLETE;
}
/* tslint:enable:max-classes-per-file */

export type  UniversalAction
  = UniversalRehydrateAction
  | UniversalReplayAction
  | UniversalReplayCompleteAction
