import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';
import { SubmissionUploadFileObject } from '../models/submission-upload-file.model';
import { SubmissionError } from './submission-objects.reducer';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const SubmissionObjectActionTypes = {
  // Section types
  NEW: type('dspace/submission/NEW'),
  ENABLE_SECTION: type('dspace/submission/ENABLE_SECTION'),
  INIT_SUBMISSION_FORM: type('dspace/submission/INIT_SUBMISSION_FORM'),
  COMPLETE_INIT_SUBMISSION_FORM: type('dspace/submission/COMPLETE_INIT_SUBMISSION_FORM'),
  DISABLE_SECTION: type('dspace/submission/DISABLE_SECTION'),
  SECTION_STATUS_CHANGE: type('dspace/submission/SECTION_STATUS_CHANGE'),
  NEW_PATCH_OPERATION: type('dspace/submission/NEW_PATCH_OPERATION'),
  FLUSH_PATCH_OPERATIONS: type('dspace/submission/FLUSH_PATCH_OPERATIONS'),

  // Upload file types
  NEW_FILE: type('dspace/submission/NEW_FILE'),
  EDIT_FILE_DATA: type('dspace/submission/EDIT_FILE_DATA'),
  DELETE_FILE: type('dspace/submission/DELETE_FILE'),

  // Errors
  INSERT_ERROR: type('dspace/submission/INSERT_ERROR'),
  DELETE_ERROR: type('dspace/submission/DELETE_ERROR'),
  CLEAR_ERRORS: type('dspace/submission/CLEAR_ERRORS'),
};


/* tslint:disable:max-classes-per-file */

/**
 * Insert a new error of type SubmissionError into the given section
 * @param {string} submissionId
 * @param {string} sectionId
 * @param {SubmissionError} error
 */
export class InertSectionErrorAction implements Action {
  type: string = SubmissionObjectActionTypes.INSERT_ERROR;
  payload: {
    submissionId: string;
    sectionId: string;
    error: SubmissionError;
  };

  constructor(submissionId: string, sectionId: string, error: SubmissionError) {
    this.payload = { submissionId, sectionId, error };
  }
}

/**
 * Delete a SubmissionError from the given section
 * @param {string} submissionId
 * @param {string} sectionId
 * @param {string | SubmissionError} error
 */
export class DeleteSectionErrorAction implements Action {
  type: string = SubmissionObjectActionTypes.DELETE_ERROR;
  payload: {
    submissionId: string;
    sectionId: string;
    error: string | SubmissionError;
  };

  constructor(submissionId: string, sectionId: string, error: string | SubmissionError) {
    this.payload = { submissionId, sectionId, error };
  }
}

/**
 * Clear all the errors from the given section
 * @param {string} submissionId
 * @param {string} sectionId
 */
export class ClearSectinErrorsAction implements Action {
  type: string = SubmissionObjectActionTypes.CLEAR_ERRORS;
  payload: {
    submissionId: string;
    sectionId: string;
  };

  constructor(submissionId: string, sectionId: string) {
    this.payload = { submissionId, sectionId }
  }
}

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
  payload: {
    submissionId: string;
  };

  /**
   * Create a new CompleteInitSubmissionFormAction
   *
   * @param submissionId
   *    the submission's ID
   */
  constructor(submissionId: string) {
    this.payload = { submissionId };
  }
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

// Upload file actions

export class NewUploadedFileAction implements Action {
  type = SubmissionObjectActionTypes.NEW_FILE;
  payload: {
    submissionId: string;
    sectionId: string;
    fileId: string;
    data: SubmissionUploadFileObject;
  };

  /**
   * Add a new uploaded file
   *
   * @param submissionId
   *    the submission's ID
   * @param sectionId
   *    the section's ID
   * @param fileId
   *    the file's ID
   * @param data
   *    the metadata of the new bitstream
   */
  constructor(submissionId: string, sectionId: string, fileId: string, data: SubmissionUploadFileObject) {
    this.payload = { submissionId, sectionId, fileId: fileId, data };
  }
}

export class EditFileDataAction implements Action {
  type = SubmissionObjectActionTypes.EDIT_FILE_DATA;
  payload: {
    submissionId: string;
    sectionId: string;
    fileId: string;
    data: SubmissionUploadFileObject;
  };

  /**
   * Edit a file data
   *
   * @param submissionId
   *    the submission's ID
   * @param sectionId
   *    the section's ID
   * @param fileId
   *    the file's ID
   * @param data
   *    the metadata of the new bitstream
   */
  constructor(submissionId: string, sectionId: string, fileId: string, data: SubmissionUploadFileObject) {
    this.payload = { submissionId, sectionId, fileId: fileId, data };
  }
}

export class DeleteUploadedFileAction implements Action {
  type = SubmissionObjectActionTypes.DELETE_FILE;
  payload: {
    submissionId: string;
    sectionId: string;
    fileId: string;
  };

  /**
   * Delete a uploaded file
   *
   * @param submissionId
   *    the submission's ID
   * @param sectionId
   *    the section's ID
   * @param fileId
   *    the file's ID
   */
  constructor(submissionId: string, sectionId: string, fileId: string) {
    this.payload = { submissionId, sectionId, fileId };
  }
}

/* tslint:enable:max-classes-per-file */

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type SubmissionObjectAction = DisableSectionAction
  | EnableSectionAction
  | InitSubmissionFormAction
  | CompleteInitSubmissionFormAction
  | SectionStatusChangeAction
  | NewUploadedFileAction
  | EditFileDataAction
  | DeleteUploadedFileAction
  | InertSectionErrorAction
  | DeleteSectionErrorAction
  | ClearSectinErrorsAction;
