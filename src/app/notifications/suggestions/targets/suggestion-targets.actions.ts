/* eslint-disable max-classes-per-file */
import { Action } from '@ngrx/store';

import { SuggestionTarget } from '../../../core/notifications/suggestions/models/suggestion-target.model';
import { type } from '../../../shared/ngrx/type';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const SuggestionTargetActionTypes = {
  ADD_TARGETS: type('dspace/integration/openaire/suggestions/target/ADD_TARGETS'),
  CLEAR_TARGETS: type('dspace/integration/openaire/suggestions/target/CLEAR_TARGETS'),
  RETRIEVE_TARGETS_BY_SOURCE: type('dspace/integration/openaire/suggestions/target/RETRIEVE_TARGETS_BY_SOURCE'),
  RETRIEVE_TARGETS_BY_SOURCE_ERROR: type('dspace/integration/openaire/suggestions/target/RETRIEVE_TARGETS_BY_SOURCE_ERROR'),
  ADD_USER_SUGGESTIONS: type('dspace/integration/openaire/suggestions/target/ADD_USER_SUGGESTIONS'),
  REFRESH_USER_SUGGESTIONS: type('dspace/integration/openaire/suggestions/target/REFRESH_USER_SUGGESTIONS'),
  REFRESH_USER_SUGGESTIONS_ERROR: type('dspace/integration/openaire/suggestions/target/REFRESH_USER_SUGGESTIONS_ERROR'),
  MARK_USER_SUGGESTIONS_AS_VISITED: type('dspace/integration/openaire/suggestions/target/MARK_USER_SUGGESTIONS_AS_VISITED'),
};

/**
 * A ngrx action to retrieve all the Suggestion Targets.
 */
export class RetrieveTargetsBySourceAction implements Action {
  type = SuggestionTargetActionTypes.RETRIEVE_TARGETS_BY_SOURCE;
  payload: {
    source: string;
    elementsPerPage: number;
    currentPage: number;
  };

  /**
   * Create a new RetrieveTargetsBySourceAction.
   *
   * @param source
   *    the source for which to retrieve suggestion targets
   * @param elementsPerPage
   *    the number of targets per page
   * @param currentPage
   *    The page number to retrieve
   */
  constructor(source: string, elementsPerPage: number, currentPage: number) {
    this.payload = {
      source,
      elementsPerPage,
      currentPage,
    };
  }
}

/**
 * A ngrx action for notifying error.
 */
export class RetrieveTargetsBySourceErrorAction implements Action {
  type = SuggestionTargetActionTypes.RETRIEVE_TARGETS_BY_SOURCE_ERROR;
  payload: {
    source: string;
  };

  /**
   * Create a new RetrieveTargetsBySourceAction.
   *
   * @param source
   *    the source for which to retrieve suggestion targets
   */
  constructor(source: string) {
    this.payload = {
      source,
    };
  }
}

/**
 * A ngrx action to load the Suggestion Target  objects.
 */
export class AddTargetAction implements Action {
  type = SuggestionTargetActionTypes.ADD_TARGETS;
  payload: {
    source: string;
    targets: SuggestionTarget[];
    totalPages: number;
    currentPage: number;
    totalElements: number;
  };

  /**
   * Create a new AddTargetAction.
   *
   * @param source
   *    the source of suggestion targets
   * @param targets
   *    the list of targets
   * @param totalPages
   *    the total available pages of targets
   * @param currentPage
   *    the current page
   * @param totalElements
   *    the total available Suggestion Targets
   */
  constructor(source: string, targets: SuggestionTarget[], totalPages: number, currentPage: number, totalElements: number) {
    this.payload = {
      source,
      targets,
      totalPages,
      currentPage,
      totalElements,
    };
  }

}

/**
 * A ngrx action to load the user Suggestion Target object.
 * Called by the ??? effect.
 */
export class AddUserSuggestionsAction implements Action {
  type = SuggestionTargetActionTypes.ADD_USER_SUGGESTIONS;
  payload: {
    suggestionTargets: SuggestionTarget[];
  };

  /**
   * Create a new AddUserSuggestionsAction.
   *
   * @param suggestionTargets
   *    the user suggestions target
   */
  constructor(suggestionTargets: SuggestionTarget[]) {
    this.payload = { suggestionTargets };
  }

}

/**
 * A ngrx action to reload the user Suggestion Target object.
 * Called by the ??? effect.
 */
export class RefreshUserSuggestionsAction implements Action {
  type = SuggestionTargetActionTypes.REFRESH_USER_SUGGESTIONS;
}

/**
 * NgRx action to signify an error while handling {@link RefreshUserSuggestionsAction}
 */
export class RefreshUserSuggestionsErrorAction implements Action {
  type = SuggestionTargetActionTypes.REFRESH_USER_SUGGESTIONS_ERROR;
}

/**
 * A ngrx action to Mark User Suggestions As Visited.
 * Called by the ??? effect.
 */
export class MarkUserSuggestionsAsVisitedAction implements Action {
  type = SuggestionTargetActionTypes.MARK_USER_SUGGESTIONS_AS_VISITED;
}

/**
 * A ngrx action to clear targets state.
 */
export class ClearSuggestionTargetsAction implements Action {
  type = SuggestionTargetActionTypes.CLEAR_TARGETS;
  payload: {
    source: string;
  };

  /**
   * Create a new ClearSuggestionTargetsAction.
   *
   * @param source
   *    the source of suggestion targets
   */
  constructor(source: string) {
    this.payload = {
      source,
    };
  }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types.
 */
export type SuggestionTargetsActions
  = AddTargetAction
  | AddUserSuggestionsAction
  | ClearSuggestionTargetsAction
  | MarkUserSuggestionsAsVisitedAction
  | RetrieveTargetsBySourceAction
  | RetrieveTargetsBySourceErrorAction
  | RefreshUserSuggestionsAction;
