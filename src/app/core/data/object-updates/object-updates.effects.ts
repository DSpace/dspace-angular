import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  DiscardObjectUpdatesAction,
  ObjectUpdatesAction,
  ObjectUpdatesActionTypes
} from './object-updates.actions';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { hasNoValue } from '../../../shared/empty.util';
import { NotificationsService } from '../../../shared/notifications/notifications.service';

@Injectable()
export class ObjectUpdatesEffects {
  private actionMap: {
    /* Use Subject instead of BehaviorSubject:
      we only want Actions that are fired while we're listening
      actions that were previously fired do not matter anymore
    */
    [url: string]: Subject<ObjectUpdatesAction>
  } = {};

  @Effect({ dispatch: false }) mapLastActions$ = this.actions$
    .pipe(
      ofType(...Object.values(ObjectUpdatesActionTypes)),
      map((action: DiscardObjectUpdatesAction) => {
          const url: string = action.payload.url;
          if (hasNoValue(this.actionMap[url])) {
            this.actionMap[url] = new Subject<ObjectUpdatesAction>();
          }
          this.actionMap[url].next(action);
        }
      )
    );

  // @Effect() removeAfterDiscardOrReinstateOnUndo$ = this.actions$
  //   .pipe(
  //     ofType(ObjectUpdatesActionTypes.DISCARD),
  //     switchMap((action: DiscardObjectUpdatesAction) => {
  //         const url: string = action.payload.url;
  //         const notification: INotification = action.payload.notification;
  //         const timeOut = notification.options.timeOut;
  //         return observableRace(
  //           // Either wait for the delay and perform a remove action
  //           observableOf(new RemoveObjectUpdatesAction(action.payload.url)).pipe(delay(timeOut)),
  //           // Or wait for a reinstate action and perform no action
  //           this.actionMap[url].pipe(
  //             // filter((updateAction: ObjectUpdatesAction) => updateAction.type === ObjectUpdatesActionTypes.REINSTATE),
  //             tap(() => this.notificationsService.remove(notification)),
  //             map(() => {
  //                 return { type: 'NO_ACTION' }
  //               }
  //             )
  //           )
  //         )
  //       }
  //     )
  //   );

  constructor(private actions$: Actions, private notificationsService: NotificationsService) {
  }

}
