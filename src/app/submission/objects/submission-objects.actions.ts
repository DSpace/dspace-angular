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
  // Section actions
  NEW: type('dspace/submission/NEW'),
  ENABLE_SECTION: type('dspace/submission/ENABLE_SECTION'),
  INIT_SUBMISSION_FORM: type('dspace/submission/INIT_SUBMISSION_FORM'),
  COMPLETE_INIT_SUBMISSION_FORM: type('dspace/submission/COMPLETE_INIT_SUBMISSION_FORM'),
  DISABLE_SECTION: type('dspace/submission/DISABLE_SECTION'),
  SECTION_STATUS_CHANGE: type('dspace/submission/SECTION_STATUS_CHANGE'),

  // Bitstream actions
  NEW_BITSTREAM: type('dspace/submission/NEW_BITSTREAM'),
  EDIT_BITSTREAM: type('dspace/submission/EDIT_BITSTREAM'),
  DELETE_BITSTREAM: type('dspace/submission/DELETE_BITSTREAM'),
};

/* tslint:disable:max-classes-per-file */

// Section actions

export class EnableSectionAction implements Action {
  type = SubmissionObjectActionTypes.ENABLE_SECTION;
  payload: {
    submissionId: string;
    sectionId: string;
    sectionViewIndex: number;
  };

  /**
   * Create a new EnableSectionAction
   *
   * @param submissionId
   *    the submission's ID to remove
   * @param sectionId
   *    the section's ID to add
   * @param sectionViewIndex
   *    the section's index in the view container
   */
  constructor(submissionId: string, sectionId: string, sectionViewIndex: number) {
    this.payload = { submissionId, sectionId, sectionViewIndex };
  }
}

export class DisableSectionAction implements Action {
  type = SubmissionObjectActionTypes.DISABLE_SECTION;
  payload: {
    submissionId: string;
    sectionId: string;
  };

  /**
   * Create a new DisableSectionAction
   *
   * @param submissionId
   *    the submission's ID to remove
   * @param sectionId
   *    the section's ID to remove
   */
  constructor(submissionId: string, sectionId: string) {
    this.payload = { submissionId, sectionId };
  }
}

export class InitSubmissionFormAction implements Action {
  type = SubmissionObjectActionTypes.INIT_SUBMISSION_FORM;
  payload: {
    collectionId: string;
    definitionId: string;
    submissionId: string;
  };

  /**
   * Create a new InitSubmissionFormAction
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

export class CompleteInitSubmissionFormAction implements Action {
  type = SubmissionObjectActionTypes.COMPLETE_INIT_SUBMISSION_FORM;
}

export class NewSubmissionFormAction implements Action {
  type = SubmissionObjectActionTypes.NEW;
  payload: {
    collectionId: string;
    submissionId: string;
  };

  /**
   * Create a new NewSubmissionFormAction
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

export class SectionStatusChangeAction implements Action {
  type = SubmissionObjectActionTypes.SECTION_STATUS_CHANGE;
  payload: {
    submissionId: string;
    sectionId: string;
    status: boolean
  };

  /**
   * Change the section validity status
   *
   * @param submissionId
   *    the submission's ID
   * @param sectionId
   *    the section's ID to change
   * @param status
   *    the section validity status (true if is valid)
   */
  constructor(submissionId: string, sectionId: string, status: boolean) {
    this.payload = { submissionId, sectionId, status };
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
  = DisableSectionAction
  | EnableSectionAction
  | InitSubmissionFormAction
  | CompleteInitSubmissionFormAction
  | SectionStatusChangeAction
  | NewBitstreamAction
  | EditBitstreamAction
  | DeleteBitstreamAction
