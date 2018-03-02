// import @ngrx
import { Action } from '@ngrx/store';

// import type function
import { type } from '../../shared/ngrx/type';

// import models
import { Notification } from './models/notification.model';

export const NotificationsActionTypes = {
  NEW_NOTIFICATION: type('dspace/notifications/NEW_NOTIFICATION'),
  NEW_NOTIFICATION_WITH_TIMER: type('dspace/notifications/NEW_NOTIFICATION_WITH_TIMER'),
  REMOVE_NOTIFICATION: type('dspace/notifications/REMOVE_NOTIFICATION'),
};

/* tslint:disable:max-classes-per-file */

/**
 * New notification.
 * @class NewNotificationAction
 * @implements {Action}
 */
export class NewNotificationAction implements Action {
  public type: string = NotificationsActionTypes.NEW_NOTIFICATION;
  payload: Notification;

  constructor(notification: Notification) {
    this.payload = notification;
  }
}

/**
 * New notification.
 * @class NewNotificationAction
 * @implements {Action}
 */
export class NewNotificationWithTimerAction implements Action {
  public type: string = NotificationsActionTypes.NEW_NOTIFICATION_WITH_TIMER;
  payload: Notification;

  constructor(notification: Notification) {
    this.payload = notification;
  }
}

/**
 * New notification.
 * @class NewNotificationAction
 * @implements {Action}
 */
export class RemoveNotificationAction implements Action {
  public type: string = NotificationsActionTypes.REMOVE_NOTIFICATION;

  constructor(public payload?: any) { }
}

/* tslint:enable:max-classes-per-file */

/**
 * Actions type.
 * @type {NotificationsActions}
 */
export type NotificationsActions
  = NewNotificationAction
  | NewNotificationWithTimerAction
  | RemoveNotificationAction;
