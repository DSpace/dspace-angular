import { Action } from '@ngrx/store';
import { type } from '../../shared/ngrx/type';
import { OpenaireBrokerTopicObject } from '../../core/openaire/models/openaire-broker-topic.model';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const OpenaireBrokerTopicActionTypes = {
  ADD_TOPICS: type('dspace/integration/openaire/broker/topic/ADD_TOPICS'),
  RETRIEVE_ALL_TOPICS: type('dspace/integration/openaire/broker/topic/RETRIEVE_ALL_TOPICS'),
  RETRIEVE_ALL_TOPICS_ERROR: type('dspace/integration/openaire/broker/topic/RETRIEVE_ALL_TOPICS_ERROR'),
}

/* tslint:disable:max-classes-per-file */

/**
 * An ngrx action to retrieve all the OpenAIRE Broker topics.
 */
export class RetrieveAllTopicsAction implements Action {
  type = OpenaireBrokerTopicActionTypes.RETRIEVE_ALL_TOPICS;
  payload: {
    name: string;
    lastEvent: string;
    elementsPerPage: number;
    currentPage: number;
  };

  /**
   * Create a new RetrieveAllTopicsAction.
   *
   * @param name
   *    The name of the topic to display on the frontend user interface
   * @param lastEvent
   *    The date of the last udate from OpenAIRE
   * @param elementsPerPage
   *    the number of topics per page
   * @param currentPage
   *    The page number to retrieve
   */
  constructor(name: string, lastEvent: string, elementsPerPage: number, currentPage: number) {
    this.payload = {
      name,
      lastEvent,
      elementsPerPage,
      currentPage
    };
  }
}

/**
 * An ngrx action for retrieving 'all OpenAIRE Broker topics' error.
 */
export class RetrieveAllTopicsErrorAction implements Action {
  type = OpenaireBrokerTopicActionTypes.RETRIEVE_ALL_TOPICS_ERROR;
}

/**
 * An ngrx action to load the OpenAIRE Broker topic objects.
 * Called by the ??? effect.
 */
export class AddTopicsAction implements Action {
  type = OpenaireBrokerTopicActionTypes.ADD_TOPICS;
  payload: {
    topics: OpenaireBrokerTopicObject[];
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
   *    the total available OpenAIRE Broker topics
   */
  constructor(topics: OpenaireBrokerTopicObject[], totalPages: number, currentPage: number, totalElements: number) {
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
export type OpenaireBrokerTopicActions
  = AddTopicsAction
  |RetrieveAllTopicsAction
  |RetrieveAllTopicsErrorAction;
