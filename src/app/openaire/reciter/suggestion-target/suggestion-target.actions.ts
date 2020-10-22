import { Action } from '@ngrx/store';
import { type } from '../../../shared/ngrx/type';
import { SuggestionTargetObject } from '../../../core/reciter-suggestions/models/suggestion-target.model';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const SuggestionTargetActionTypes = {
  ADD_TARGETS: type('dspace/integration/suggestion/target/ADD_TARGETS'),
  RETRIEVE_ALL_TARGETS: type('dspace/integration/suggestion/target/RETRIEVE_ALL_TARGETS'),
  RETRIEVE_ALL_TARGETS_ERROR: type('dspace/integration/suggestion/target/RETRIEVE_ALL_TARGETS_ERROR'),
}

/* tslint:disable:max-classes-per-file */

/**
 * An ngrx action to retrieve all the Suggestion Targets.
 */
export class RetrieveAllTargetsAction implements Action {
  type = SuggestionTargetActionTypes.RETRIEVE_ALL_TARGETS;
  payload: {
    elementsPerPage: number;
    currentPage: number;
  };

  /**
   * Create a new RetrieveAllTargetsAction.
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
 * An ngrx action for retrieving 'all Suggestion Targets' error.
 */
export class RetrieveAllTargetsErrorAction implements Action {
  type = SuggestionTargetActionTypes.RETRIEVE_ALL_TARGETS_ERROR;
}

/**
 * An ngrx action to load the Suggestion Target  objects.
 * Called by the ??? effect.
 */
export class AddTargetAction implements Action {
  type = SuggestionTargetActionTypes.ADD_TARGETS;
  payload: {
    targets: SuggestionTargetObject[];
    totalPages: number;
    currentPage: number;
    totalElements: number;
  };

  /**
   * Create a new AddTopicsAction.
   *
   * @param targets
   *    the list of targets
   * @param totalPages
   *    the total available pages of topics
   * @param currentPage
   *    the current page
   * @param totalElements
   *    the total available Suggestion Targets
   */
  constructor(targets: SuggestionTargetObject[], totalPages: number, currentPage: number, totalElements: number) {
    this.payload = {
      targets,
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
export type SuggestionTargetActions
  = AddTargetAction
  | RetrieveAllTargetsAction
  | RetrieveAllTargetsErrorAction;
