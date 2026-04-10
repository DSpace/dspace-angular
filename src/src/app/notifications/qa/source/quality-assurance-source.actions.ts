/* eslint-disable max-classes-per-file */
import { Action } from '@ngrx/store';

import { QualityAssuranceSourceObject } from '../../../core/notifications/qa/models/quality-assurance-source.model';
import { type } from '../../../shared/ngrx/type';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const QualityAssuranceSourceActionTypes = {
  ADD_SOURCE: type('dspace/integration/notifications/qa/ADD_SOURCE'),
  RETRIEVE_ALL_SOURCE: type('dspace/integration/notifications/qa/RETRIEVE_ALL_SOURCE'),
  RETRIEVE_ALL_SOURCE_ERROR: type('dspace/integration/notifications/qa/RETRIEVE_ALL_SOURCE_ERROR'),
};

/**
 * An ngrx action to retrieve all the Quality Assurance source.
 */
export class RetrieveAllSourceAction implements Action {
  type = QualityAssuranceSourceActionTypes.RETRIEVE_ALL_SOURCE;
  payload: {
    elementsPerPage: number;
    currentPage: number;
  };

  /**
   * Create a new RetrieveAllSourceAction.
   *
   * @param elementsPerPage
   *    the number of source per page
   * @param currentPage
   *    The page number to retrieve
   */
  constructor(elementsPerPage: number, currentPage: number) {
    this.payload = {
      elementsPerPage,
      currentPage,
    };
  }
}

/**
 * An ngrx action for retrieving 'all Quality Assurance source' error.
 */
export class RetrieveAllSourceErrorAction implements Action {
  type = QualityAssuranceSourceActionTypes.RETRIEVE_ALL_SOURCE_ERROR;
}

/**
 * An ngrx action to load the Quality Assurance source objects.
 * Called by the ??? effect.
 */
export class AddSourceAction implements Action {
  type = QualityAssuranceSourceActionTypes.ADD_SOURCE;
  payload: {
    source: QualityAssuranceSourceObject[];
    totalPages: number;
    currentPage: number;
    totalElements: number;
  };

  /**
   * Create a new AddSourceAction.
   *
   * @param source
   *    the list of source
   * @param totalPages
   *    the total available pages of source
   * @param currentPage
   *    the current page
   * @param totalElements
   *    the total available Quality Assurance source
   */
  constructor(source: QualityAssuranceSourceObject[], totalPages: number, currentPage: number, totalElements: number) {
    this.payload = {
      source,
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
export type QualityAssuranceSourceActions
  = RetrieveAllSourceAction
  |RetrieveAllSourceErrorAction
  |AddSourceAction;
