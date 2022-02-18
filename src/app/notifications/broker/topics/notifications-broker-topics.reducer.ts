import { NotificationsBrokerTopicObject } from '../../../core/notifications/broker/models/notifications-broker-topic.model';
import { NotificationsBrokerTopicActionTypes, NotificationsBrokerTopicsActions } from './notifications-broker-topics.actions';

/**
 * The interface representing the Notifications Broker topic state.
 */
export interface NotificationsBrokerTopicState {
  topics: NotificationsBrokerTopicObject[];
  processing: boolean;
  loaded: boolean;
  totalPages: number;
  currentPage: number;
  totalElements: number;
}

/**
 * Used for the Notifications Broker topic state initialization.
 */
const notificationsBrokerTopicInitialState: NotificationsBrokerTopicState = {
  topics: [],
  processing: false,
  loaded: false,
  totalPages: 0,
  currentPage: 0,
  totalElements: 0
};

/**
 * The Notifications Broker Topic Reducer
 *
 * @param state
 *    the current state initialized with notificationsBrokerTopicInitialState
 * @param action
 *    the action to perform on the state
 * @return NotificationsBrokerTopicState
 *    the new state
 */
export function notificationsBrokerTopicsReducer(state = notificationsBrokerTopicInitialState, action: NotificationsBrokerTopicsActions): NotificationsBrokerTopicState {
  switch (action.type) {
    case NotificationsBrokerTopicActionTypes.RETRIEVE_ALL_TOPICS: {
      return Object.assign({}, state, {
        topics: [],
        processing: true
      });
    }

    case NotificationsBrokerTopicActionTypes.ADD_TOPICS: {
      return Object.assign({}, state, {
        topics: action.payload.topics,
        processing: false,
        loaded: true,
        totalPages: action.payload.totalPages,
        currentPage: state.currentPage,
        totalElements: action.payload.totalElements
      });
    }

    case NotificationsBrokerTopicActionTypes.RETRIEVE_ALL_TOPICS_ERROR: {
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
