import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';
import { SubmissionBitstreamObject } from './submission-objects.reducer';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const SubmissionObjectActionTypes = {
  // Panel actions
  NEW: type('dspace/submission/NEW'),
  ENABLE_PANEL: type('dspace/submission/ENABLE_PANEL'),
  INIT_SUBMISSION_FORM: type('dspace/submission/INIT_SUBMISSION_FORM'),
  COMPLETE_INIT_SUBMISSION_FORM: type('dspace/submission/COMPLETE_INIT_SUBMISSION_FORM'),
  DISABLE_PANEL: type('dspace/submission/DISABLE_PANEL'),
  PANEL_STATUS_CHANGE: type('dspace/submission/PANEL_STATUS_CHANGE'),

  // Bitstream actions
  NEW_BITSTREAM: type('dspace/submission/NEW_BITSTREAM'),
  EDIT_BITSTREAM: type('dspace/submission/EDIT_BITSTREAM'),
  DELETE_BITSTREAM: type('dspace/submission/DELETE_BITSTREAM'),
};

/* tslint:disable:max-classes-per-file */

// Panel actions

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

export class PanelStatusChangeAction implements Action {
  type = SubmissionObjectActionTypes.PANEL_STATUS_CHANGE;
  payload: {
    submissionId: string;
    panelId: string;
    status: boolean
  };

  /**
   * Change the panel validity status
   *
   * @param submissionId
   *    the submission's ID
   * @param panelId
   *    the panel's ID to change
   * @param status
   *    the panel validity status (true if is valid)
   */
  constructor(submissionId: string, panelId: string, status: boolean) {
    this.payload = { submissionId, panelId, status };
  }
}

// Bitstream actions

export class NewBitstreamAction implements Action {
  type = SubmissionObjectActionTypes.NEW_BITSTREAM;
  payload: {
    submissionId: string;
    bitstreamId: string;
    data: SubmissionBitstreamObject;
  };

  /**
   * Create a new bitstream
   *
   * @param submissionId
   *    the submission's ID
   * @param bitstreamId
   *    the bitstream's ID
   * @param data
   *    the metadata of the new bitstream
   */
  constructor(submissionId: string, bitstreamId: string, data: SubmissionBitstreamObject) {
    this.payload = { submissionId, bitstreamId, data };
  }
}

export class EditBitstreamAction implements Action {
  type = SubmissionObjectActionTypes.EDIT_BITSTREAM;
  payload: {
    submissionId: string;
    bitstreamId: string;
    data: SubmissionBitstreamObject;
  };

  /**
   * Edit a bitstream
   *
   * @param submissionId
   *    the submission's ID
   * @param bitstreamId
   *    the bitstream's ID
   * @param data
   *    the metadata of the new bitstream
   */
  constructor(submissionId: string, bitstreamId: string, data: SubmissionBitstreamObject) {
    this.payload = { submissionId, bitstreamId, data};
  }
}

export class DeleteBitstreamAction implements Action {
  type = SubmissionObjectActionTypes.DELETE_BITSTREAM;
  payload: {
    submissionId: string;
    bitstreamId: string;
  };

  /**
   * Delete a bitstream
   *
   * @param submissionId
   *    the submission's ID
   * @param bitstreamId
   *    the bitstream's ID
   */
  constructor(submissionId: string, bitstreamId: string) {
    this.payload = { submissionId, bitstreamId};
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
  | PanelStatusChangeAction
  | NewBitstreamAction
  | EditBitstreamAction
  | DeleteBitstreamAction
