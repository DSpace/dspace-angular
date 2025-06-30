/* eslint-disable max-classes-per-file */
import { Action } from '@ngrx/store';

import { QualityAssuranceTopicObject } from '../../../core/notifications/qa/models/quality-assurance-topic.model';
import { type } from '../../../shared/ngrx/type';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const QualityAssuranceTopicActionTypes = {
  ADD_TOPICS: type('dspace/integration/notifications/qa/topic/ADD_TOPICS'),
  RETRIEVE_ALL_TOPICS: type('dspace/integration/notifications/qa/topic/RETRIEVE_ALL_TOPICS'),
  RETRIEVE_ALL_TOPICS_ERROR: type('dspace/integration/notifications/qa/topic/RETRIEVE_ALL_TOPICS_ERROR'),
};

/**
 * An ngrx action to retrieve all the Quality Assurance topics.
 */
export class RetrieveAllTopicsAction implements Action {
  type = QualityAssuranceTopicActionTypes.RETRIEVE_ALL_TOPICS;
  payload: {
    elementsPerPage: number;
    currentPage: number;
    source: string;
    target?: string;
  };

  /**
   * Create a new RetrieveAllTopicsAction.
   *
   * @param elementsPerPage
   *    the number of topics per page
   * @param currentPage
   *    The page number to retrieve
   */
  constructor(elementsPerPage: number, currentPage: number, source: string, target?: string) {
    this.payload = {
      elementsPerPage,
      currentPage,
      source,
      target,
    };
  }
}

/**
 * An ngrx action for retrieving 'all Quality Assurance topics' error.
 */
export class RetrieveAllTopicsErrorAction implements Action {
  type = QualityAssuranceTopicActionTypes.RETRIEVE_ALL_TOPICS_ERROR;
}

/**
 * An ngrx action to load the Quality Assurance topic objects.
 * Called by the ??? effect.
 */
export class AddTopicsAction implements Action {
  type = QualityAssuranceTopicActionTypes.ADD_TOPICS;
  payload: {
    topics: QualityAssuranceTopicObject[];
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
   *    the total available Quality Assurance topics
   */
  constructor(topics: QualityAssuranceTopicObject[], totalPages: number, currentPage: number, totalElements: number) {
    this.payload = {
      topics,
      totalPages,
      currentPage,
      totalElements,
    };
  }

}

/* tslint:enable:max-classes-per-file */

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types.
 */
export type QualityAssuranceTopicsActions
  = AddTopicsAction
  |RetrieveAllTopicsAction
  |RetrieveAllTopicsErrorAction;
