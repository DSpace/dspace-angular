import 'rxjs/add/operator/withLatestFrom';

import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';

import { AppState } from './app.reducer';
import { StoreAction, StoreActionTypes } from './store.actions';
import { HostWindowResizeAction, HostWindowActionTypes } from './shared/host-window.actions';

@Injectable()
export class StoreEffects {

  @Effect({ dispatch: false }) replay = this.actions.ofType(StoreActionTypes.REPLAY).map((replayAction: Action) => {
    // TODO: should be able to replay all actions before the browser attempts to
    // replayAction.payload.forEach((action: Action) => {
    //   this.store.dispatch(action);
    // });
    return Observable.of({});
  });

  @Effect() resize = this.actions.ofType(StoreActionTypes.REPLAY, StoreActionTypes.REHYDRATE).map(() => new HostWindowResizeAction(window.innerWidth, window.innerHeight));

  constructor(private actions: Actions, private store: Store<AppState>) {

  }

}
