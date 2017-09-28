import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';
import { PanelObject } from './submission-definitions.reducer';

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
  INIT_DEFINITIONS: type('dspace/submission/definition/INIT_DEFINITIONS'),
  RETRIEVE_DEFINITIONS: type('dspace/submission/definition/RETRIEVE_DEFINITIONS'),
  COMPLETE_INIT_DEFINITIONS: type('dspace/submission/definition/COMPLETE_INIT_DEFINITIONS'),
};

/* tslint:disable:max-classes-per-file */

export class InitDefinitionsAction implements Action {
  type = SubmissionDefinitionActionTypes.INIT_DEFINITIONS;
}

export class CompleteInitAction implements Action {
  type = SubmissionDefinitionActionTypes.COMPLETE_INIT_DEFINITIONS;
}

export class NewDefinitionAction implements Action {
  type = SubmissionDefinitionActionTypes.NEW_DEFINITION;
  payload: {
    definitionId: string;
    isDefault;
  };

  /**
   * Create a new NewDefinitionAction
   *
   * @param definitionId
   *    the definition's ID where to instantiate
   * @param isDefault
   *    defines which definition use as default
   */
  constructor(definitionId: string, isDefault: boolean) {
    this.payload = { definitionId, isDefault };
  }
}

export class NewPanelDefinitionAction implements Action {
  type = SubmissionDefinitionActionTypes.NEW_PANEL_DEFINITION;
  payload: {
    definitionId: string;
    panelId: string;
    panelObject: PanelObject;
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
  constructor(definitionId: string, panelId: string, panelObject: PanelObject) {
    this.payload = { definitionId, panelId: panelId, panelObject: panelObject };
  }
}

export class RetrieveDefinitionsAction implements Action {
  type = SubmissionDefinitionActionTypes.RETRIEVE_DEFINITIONS;
}

/* tslint:enable:max-classes-per-file */

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type DefinitionsAction
  = NewPanelDefinitionAction
  | CompleteInitAction
