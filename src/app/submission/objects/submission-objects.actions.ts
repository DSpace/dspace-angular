import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';
import { SubmissionError } from './submission-objects.reducer';
import { WorkspaceitemSectionUploadFileObject } from '../models/workspaceitem-section-upload-file.model';
import { WorkspaceitemSectionFormObject } from '../models/workspaceitem-section-form.model';
import { WorkspaceitemSectionLicenseObject } from '../models/workspaceitem-section-license.model';
import { WorkspaceitemSectionsObject } from '../models/workspaceitem-sections.model';

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
  LOAD_SUBMISSION_FORM: type('dspace/submission/LOAD_SUBMISSION_FORM'),
  RESET_SUBMISSION_FORM: type('dspace/submission/RESET_SUBMISSION_FORM'),
  INIT_SUBMISSION_FORM: type('dspace/submission/INIT_SUBMISSION_FORM'),
  COMPLETE_INIT_SUBMISSION_FORM: type('dspace/submission/COMPLETE_INIT_SUBMISSION_FORM'),
  ENABLE_SECTION: type('dspace/submission/ENABLE_SECTION'),
  DISABLE_SECTION: type('dspace/submission/DISABLE_SECTION'),
  SECTION_STATUS_CHANGE: type('dspace/submission/SECTION_STATUS_CHANGE'),
  NEW_PATCH_OPERATION: type('dspace/submission/NEW_PATCH_OPERATION'),
  FLUSH_PATCH_OPERATIONS: type('dspace/submission/FLUSH_PATCH_OPERATIONS'),

  // Upload file types
  NEW_FILE: type('dspace/submission/NEW_FILE'),
  EDIT_FILE_DATA: type('dspace/submission/EDIT_FILE_DATA'),
  DELETE_FILE: type('dspace/submission/DELETE_FILE'),

  // Errors
  INSERT_ERRORS: type('dspace/submission/INSERT_ERRORS'),
  DELETE_ERRORS: type('dspace/submission/DELETE_ERRORS'),
  CLEAR_ERRORS: type('dspace/submission/CLEAR_ERRORS'),
};


/* tslint:disable:max-classes-per-file */

/**
 * Insert a new error of type SubmissionError into the given section
 * @param {string} submissionId
 * @param {string} sectionId
 * @param {SubmissionError} error
 */
export class InertSectionErrorsAction implements Action {
  type: string = SubmissionObjectActionTypes.INSERT_ERRORS;
  payload: {
    submissionId: string;
    sectionId: string;
    error: SubmissionError | SubmissionError[];
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
export class DeleteSectionErrorsAction implements Action {
  type: string = SubmissionObjectActionTypes.DELETE_ERRORS;
  payload: {
    submissionId: string;
    sectionId: string;
    error: string | SubmissionError | SubmissionError[];
  };

  constructor(submissionId: string, sectionId: string, error: string | SubmissionError | SubmissionError[]) {
    this.payload = { submissionId, sectionId, error };
  }
}

/**
 * Clear all the errors from the given section
 * @param {string} submissionId
 * @param {string} sectionId
 */
export class ClearSectionErrorsAction implements Action {
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
    data: WorkspaceitemSectionFormObject | WorkspaceitemSectionUploadFileObject | WorkspaceitemSectionLicenseObject
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
  constructor(submissionId: string, sectionId: string, sectionViewIndex: number, data: WorkspaceitemSectionFormObject | WorkspaceitemSectionUploadFileObject | WorkspaceitemSectionLicenseObject) {
    this.payload = { submissionId, sectionId, sectionViewIndex, data };
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
    sections: WorkspaceitemSectionsObject;
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
  constructor(collectionId: string, definitionId: string, submissionId: string, sections: WorkspaceitemSectionsObject) {
    this.payload = { collectionId, definitionId, submissionId, sections };
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

export class LoadSubmissionFormAction implements Action {
  type = SubmissionObjectActionTypes.LOAD_SUBMISSION_FORM;
  payload: {
    collectionId: string;
    submissionId: string;
    sections: WorkspaceitemSectionsObject;
  };

  /**
   * Create a new LoadSubmissionFormAction
   *
   * @param collectionId
   *    the collection's Id where to deposit
   * @param submissionId
   *    the submission's ID
   */
  constructor(collectionId: string, submissionId: string, sections: WorkspaceitemSectionsObject) {
    this.payload = { collectionId, submissionId, sections };
  }
}

export class ResetSubmissionFormAction implements Action {
  type = SubmissionObjectActionTypes.RESET_SUBMISSION_FORM;
  payload: {
    collectionId: string;
    submissionId: string;
    sections: WorkspaceitemSectionsObject;
  };

  /**
   * Create a new LoadSubmissionFormAction
   *
   * @param collectionId
   *    the collection's Id where to deposit
   * @param submissionId
   *    the submission's ID
   */
  constructor(collectionId: string, submissionId: string, sections: WorkspaceitemSectionsObject) {
    this.payload = { collectionId, submissionId, sections };
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
    data: WorkspaceitemSectionUploadFileObject;
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
  constructor(submissionId: string, sectionId: string, fileId: string, data: WorkspaceitemSectionUploadFileObject) {
    this.payload = { submissionId, sectionId, fileId: fileId, data };
  }
}

export class EditFileDataAction implements Action {
  type = SubmissionObjectActionTypes.EDIT_FILE_DATA;
  payload: {
    submissionId: string;
    sectionId: string;
    fileId: string;
    data: WorkspaceitemSectionUploadFileObject;
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
  constructor(submissionId: string, sectionId: string, fileId: string, data: WorkspaceitemSectionUploadFileObject) {
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
  | LoadSubmissionFormAction
  | ResetSubmissionFormAction
  | InitSubmissionFormAction
  | CompleteInitSubmissionFormAction
  | SectionStatusChangeAction
  | NewUploadedFileAction
  | EditFileDataAction
  | DeleteUploadedFileAction
  | InertSectionErrorsAction
  | DeleteSectionErrorsAction
  | ClearSectionErrorsAction;
