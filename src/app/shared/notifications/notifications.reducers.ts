// import actions
import { NotificationsActions, NotificationsActionTypes } from './notifications.actions';

// import models
import { INotification } from './models/notification.model';

/**
 * The auth state.
 * @interface State
 */
export interface NotificationsState {
  [index: number]: INotification;
}

/**
 * The initial state.
 */
const initialState: NotificationsState = [];

/**
 * The reducer function.
 * @function reducer
 * @param {State} state Current state
 * @param {NotificationsActions} action Incoming action
 */
export function notificationsReducer(state: any = initialState, action: NotificationsActions): NotificationsState {

  switch (action.type) {
    case NotificationsActionTypes.NEW_NOTIFICATION:
    case NotificationsActionTypes.NEW_NOTIFICATION_WITH_TIMER:
      return [...state, action.payload];

    case NotificationsActionTypes.REMOVE_NOTIFICATION:
      return [];

    default:
      return state;
  }
}
