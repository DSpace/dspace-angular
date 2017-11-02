import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import 'rxjs/add/operator/withLatestFrom';

import { Observable } from 'rxjs/Observable';
import {
  UniversalActionTypes,
  UniversalReplayAction,
  UniversalReplayCompleteAction
} from './universal.actions';

@Injectable()
export class UniversalEffects {

  @Effect() replay$ = this.actions
    .ofType(UniversalActionTypes.REPLAY)
    .map((replayAction: UniversalReplayAction) => replayAction.payload)
    .map((actions: Action[]) => [...actions, new UniversalReplayCompleteAction()])
    .flatMap((actions: Action[]) => Observable.from(actions));

  constructor(private actions: Actions) {

  }

}
