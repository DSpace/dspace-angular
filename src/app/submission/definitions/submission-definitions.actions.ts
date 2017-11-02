import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';
import { PanelObject } from './submission-definitions.reducer';
import { SubmissionSectionModel } from '../../core/shared/config/config-submission-section.model';
import { SubmissionDefinitionsModel } from '../../core/shared/config/config-submission-definitions.model';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const SubmissionDefinitionActionTypes = {
  NEW_DEFINITION: type('dspace/submission/definition/NEW_DEFINITION'),
  NEW_PANEL_DEFINITION: type('dspace/submission/definition/NEW_PANEL_DEFINITION'),
  INIT_DEFAULT_DEFINITION: type('dspace/submission/definition/INIT_DEFAULT_DEFINITION'),
  COMPLETE_INIT_DEFAULT_DEFINITION: type('dspace/submission/definition/COMPLETE_INIT_DEFAULT_DEFINITION'),
};

/* tslint:disable:max-classes-per-file */

export class InitDefaultDefinitionAction implements Action {
  type = SubmissionDefinitionActionTypes.INIT_DEFAULT_DEFINITION;
  payload: {
    collectionId: string;
    submissionId: string;
  };

  /**
   * Create a new InitDefaultDefinitionAction
   *
   * @param collectionId
   *    the collection's Id where to deposit
   * @param submissionId
   *    the submission's ID
   */
  constructor(collectionId: string, submissionId: string) {
    this.payload = { collectionId, submissionId };
  }
}

export class CompleteInitAction implements Action {
  type = SubmissionDefinitionActionTypes.COMPLETE_INIT_DEFAULT_DEFINITION;
  payload: {
    collectionId: string;
    definitionId: string;
    submissionId: string;
  };

  /**
   * Create a new CompleteInitAction
   *
   * @param collectionId
   *    the collection's Id where to deposit
   * @param definitionId
   *    the definition's ID to use
   * @param submissionId
   *    the submission's ID
   */
  constructor(collectionId: string, definitionId: string, submissionId: string) {
    this.payload = { collectionId, definitionId, submissionId };
  }
}

export class NewDefinitionAction implements Action {
  type = SubmissionDefinitionActionTypes.NEW_DEFINITION;
  payload: {
    definition: SubmissionDefinitionsModel;
  };

  /**
   * Create a new NewDefinitionAction
   *
   * @param definition
   *    the definition's model to instantiate
   */
  constructor(definition: SubmissionDefinitionsModel) {
    this.payload = { definition };
  }
}

export class NewPanelDefinitionAction implements Action {
  type = SubmissionDefinitionActionTypes.NEW_PANEL_DEFINITION;
  payload: {
    definitionId: string;
    panelId: string;
    panelObject: SubmissionSectionModel;
  };

  /**
   * Create a new NewPanelDefinitionAction
   *
   * @param definitionId
   *    the definition's ID where to panel-add panel
   * @param panelId
   *    the panel's ID to panel-add
   * @param panelObject
   *    the panel's properties
   */
  constructor(definitionId: string, panelId: string, panelObject: SubmissionSectionModel) {
    this.payload = { definitionId, panelId: panelId, panelObject: panelObject};
  }
}

/* tslint:enable:max-classes-per-file */

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type DefinitionsAction
  = InitDefaultDefinitionAction
  | CompleteInitAction
  | NewDefinitionAction
  | NewPanelDefinitionAction
