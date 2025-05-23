import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
} from '@ngrx/effects';
import {
  Action,
  Store,
} from '@ngrx/store';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppState } from './app.reducer';
import { HostWindowResizeAction } from './shared/host-window.actions';
import { StoreActionTypes } from './store.actions';

@Injectable()
export class StoreEffects {

  replay = createEffect(() => this.actions.pipe(
    ofType(StoreActionTypes.REPLAY),
    map((replayAction: Action) => {
      // TODO: should be able to replay all actions before the browser attempts to
      // replayAction.payload.forEach((action: Action) => {
      //   this.store.dispatch(action);
      // });
      return of({});
    })), { dispatch: false });

  resize = createEffect(() => this.actions.pipe(
    ofType(StoreActionTypes.REPLAY, StoreActionTypes.REHYDRATE),
    map(() => new HostWindowResizeAction(window.innerWidth, window.innerHeight)),
  ));

  constructor(private actions: Actions, private store: Store<AppState>) {

  }

}
