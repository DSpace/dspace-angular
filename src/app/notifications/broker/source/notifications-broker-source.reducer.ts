import { NotificationsBrokerSourceObject } from '../../../core/notifications/broker/models/notifications-broker-source.model';
import { NotificationsBrokerSourceActionTypes, NotificationsBrokerSourceActions } from './notifications-broker-source.actions';

/**
 * The interface representing the Notifications Broker source state.
 */
export interface NotificationsBrokerSourceState {
  source: NotificationsBrokerSourceObject[];
  processing: boolean;
  loaded: boolean;
  totalPages: number;
  currentPage: number;
  totalElements: number;
}

/**
 * Used for the Notifications Broker source state initialization.
 */
const notificationsBrokerSourceInitialState: NotificationsBrokerSourceState = {
  source: [],
  processing: false,
  loaded: false,
  totalPages: 0,
  currentPage: 0,
  totalElements: 0
};

/**
 * The Notifications Broker Source Reducer
 *
 * @param state
 *    the current state initialized with notificationsBrokerSourceInitialState
 * @param action
 *    the action to perform on the state
 * @return NotificationsBrokerSourceState
 *    the new state
 */
export function notificationsBrokerSourceReducer(state = notificationsBrokerSourceInitialState, action: NotificationsBrokerSourceActions): NotificationsBrokerSourceState {
  switch (action.type) {
    case NotificationsBrokerSourceActionTypes.RETRIEVE_ALL_SOURCE: {
      return Object.assign({}, state, {
        source: [],
        processing: true
      });
    }

    case NotificationsBrokerSourceActionTypes.ADD_SOURCE: {
      return Object.assign({}, state, {
        source: action.payload.source,
        processing: false,
        loaded: true,
        totalPages: action.payload.totalPages,
        currentPage: state.currentPage,
        totalElements: action.payload.totalElements
      });
    }

    case NotificationsBrokerSourceActionTypes.RETRIEVE_ALL_SOURCE_ERROR: {
      return Object.assign({}, state, {
        processing: false,
        loaded: true,
        totalPages: 0,
        currentPage: 0,
        totalElements: 0
      });
    }

    default: {
      return state;
    }
  }
}
