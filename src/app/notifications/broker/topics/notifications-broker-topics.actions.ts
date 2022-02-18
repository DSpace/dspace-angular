import { Action } from '@ngrx/store';
import { type } from '../../../shared/ngrx/type';
import { NotificationsBrokerTopicObject } from '../../../core/notifications/broker/models/notifications-broker-topic.model';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const NotificationsBrokerTopicActionTypes = {
  ADD_TOPICS: type('dspace/integration/notifications/broker/topic/ADD_TOPICS'),
  RETRIEVE_ALL_TOPICS: type('dspace/integration/notifications/broker/topic/RETRIEVE_ALL_TOPICS'),
  RETRIEVE_ALL_TOPICS_ERROR: type('dspace/integration/notifications/broker/topic/RETRIEVE_ALL_TOPICS_ERROR'),
};

/* tslint:disable:max-classes-per-file */

/**
 * An ngrx action to retrieve all the Notifications Broker topics.
 */
export class RetrieveAllTopicsAction implements Action {
  type = NotificationsBrokerTopicActionTypes.RETRIEVE_ALL_TOPICS;
  payload: {
    elementsPerPage: number;
    currentPage: number;
  };

  /**
   * Create a new RetrieveAllTopicsAction.
   *
   * @param elementsPerPage
   *    the number of topics per page
   * @param currentPage
   *    The page number to retrieve
   */
  constructor(elementsPerPage: number, currentPage: number) {
    this.payload = {
      elementsPerPage,
      currentPage
    };
  }
}

/**
 * An ngrx action for retrieving 'all Notifications Broker topics' error.
 */
export class RetrieveAllTopicsErrorAction implements Action {
  type = NotificationsBrokerTopicActionTypes.RETRIEVE_ALL_TOPICS_ERROR;
}

/**
 * An ngrx action to load the Notifications Broker topic objects.
 * Called by the ??? effect.
 */
export class AddTopicsAction implements Action {
  type = NotificationsBrokerTopicActionTypes.ADD_TOPICS;
  payload: {
    topics: NotificationsBrokerTopicObject[];
    totalPages: number;
    currentPage: number;
    totalElements: number;
  };

  /**
   * Create a new AddTopicsAction.
   *
   * @param topics
   *    the list of topics
   * @param totalPages
   *    the total available pages of topics
   * @param currentPage
   *    the current page
   * @param totalElements
   *    the total available Notifications Broker topics
   */
  constructor(topics: NotificationsBrokerTopicObject[], totalPages: number, currentPage: number, totalElements: number) {
    this.payload = {
      topics,
      totalPages,
      currentPage,
      totalElements
    };
  }

}

/* tslint:enable:max-classes-per-file */

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types.
 */
export type NotificationsBrokerTopicsActions
  = AddTopicsAction
  |RetrieveAllTopicsAction
  |RetrieveAllTopicsErrorAction;
