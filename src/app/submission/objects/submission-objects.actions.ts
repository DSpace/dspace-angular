import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const SubmissionObjectActionTypes = {
  NEW: type('dspace/submission/NEW'),
  ENABLE_PANEL: type('dspace/submission/ENABLE_PANEL'),
  INIT_SUBMISSION_FORM: type('dspace/submission/INIT_SUBMISSION_FORM'),
  COMPLETE_INIT_SUBMISSION_FORM: type('dspace/submission/COMPLETE_INIT_SUBMISSION_FORM'),
  DISABLE_PANEL: type('dspace/submission/DISABLE_PANEL')
};

/* tslint:disable:max-classes-per-file */
export class EnablePanelAction implements Action {
  type = SubmissionObjectActionTypes.ENABLE_PANEL;
  payload: {
    submissionId: string;
    panelId: string;
    panelViewIndex: number;
  };

  /**
   * Create a new EnablePanelAction
   *
   * @param submissionId
   *    the submission's ID to remove
   * @param panelId
   *    the panel's ID to panel-add
   * @param panelViewIndex
   *    the panel's index in the view container
   */
  constructor(submissionId: string, panelId: string, panelViewIndex: number) {
    this.payload = { submissionId, panelId, panelViewIndex };
  }
}

export class DisablePanelAction implements Action {
  type = SubmissionObjectActionTypes.DISABLE_PANEL;
  payload: {
    submissionId: string;
    panelId: string;
  };

  /**
   * Create a new DisablePanelAction
   *
   * @param submissionId
   *    the submission's ID to remove
   * @param panelId
   *    the panel's ID to remove
   */
  constructor(submissionId: string, panelId: string) {
    this.payload = { submissionId, panelId };
  }
}

export class InitSubmissionFormAction implements Action {
  type = SubmissionObjectActionTypes.INIT_SUBMISSION_FORM;
  payload: {
    submissionId: string;
    definitionId: string;
  };

  /**
   * Create a new InitSubmissionFormAction
   *
   * @param submissionId
   *    the submission's ID
   * @param definitionId
   *    the definition's ID to use
   */
  constructor(submissionId: string, definitionId: string) {
    this.payload = { submissionId, definitionId };
  }
}

export class CompleteInitSubmissionFormAction implements Action {
  type = SubmissionObjectActionTypes.COMPLETE_INIT_SUBMISSION_FORM;
}

export class NewSubmissionFormAction implements Action {
  type = SubmissionObjectActionTypes.NEW;
  payload: {
    submissionId: string;
    definitionId: string;
  };

  /**
   * Create a new NewSubmissionFormAction
   *
   * @param submissionId
   *    the submission's ID
   * @param definitionId
   *    the definition's ID to use
   */
  constructor(submissionId: string, definitionId: string) {
    this.payload = { submissionId, definitionId };
  }
}

/* tslint:enable:max-classes-per-file */

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type SubmissionObjectAction
  = DisablePanelAction
  | EnablePanelAction
  | InitSubmissionFormAction
  | CompleteInitSubmissionFormAction
