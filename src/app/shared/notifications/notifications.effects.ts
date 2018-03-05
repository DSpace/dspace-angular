import { Injectable } from '@angular/core';

// import @ngrx
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

// import rxjs
import { Observable } from 'rxjs/Observable';

// import services

// import actions

import { AppState } from '../../app.reducer';
import {
  NewNotificationWithTimerAction, NotificationsActionTypes,
  RemoveNotificationAction
} from './notifications.actions';

@Injectable()
export class NotificationsEffects {

  /**
   * Authenticate user.
   * @method authenticate
   */
 /* @Effect()
  public timer: Observable<Action> = this.actions$
    .ofType(NotificationsActionTypes.NEW_NOTIFICATION_WITH_TIMER)
    // .debounceTime((action: any) => action.payload.options.timeOut)
    .debounceTime(3000)
    .map(() => new RemoveNotificationAction());
     .switchMap((action: NewNotificationWithTimerAction) => Observable
      .timer(30000)
      .mapTo(() => new RemoveNotificationAction())
    );*/

  /**
   * @constructor
   * @param {Actions} actions$
   * @param {AuthService} authService
   * @param {Store} store
   */
  constructor(private actions$: Actions,
              private store: Store<AppState>) {
  }
}
