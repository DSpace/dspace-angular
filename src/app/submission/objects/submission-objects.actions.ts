import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';
import { SubmissionSectionError } from './submission-objects.reducer';
import { WorkspaceitemSectionUploadFileObject } from '../../core/submission/models/workspaceitem-section-upload-file.model';
import { WorkspaceitemSectionFormObject } from '../../core/submission/models/workspaceitem-section-form.model';
import { WorkspaceitemSectionLicenseObject } from '../../core/submission/models/workspaceitem-section-license.model';
import {
  WorkspaceitemSectionDataType,
  WorkspaceitemSectionsObject
} from '../../core/submission/models/workspaceitem-sections.model';
import { WorkspaceitemSectionUploadObject } from '../../core/submission/models/workspaceitem-section-upload.model';
import { SubmissionObject } from '../../core/submission/models/submission-object.model';
import { SubmissionDefinitionsModel } from '../../core/shared/config/config-submission-definitions.model';

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
  CANCEL_SUBMISSION_FORM: type('dspace/submission/CANCEL_SUBMISSION_FORM'),
  INIT_SUBMISSION_FORM: type('dspace/submission/INIT_SUBMISSION_FORM'),
  COMPLETE_INIT_SUBMISSION_FORM: type('dspace/submission/COMPLETE_INIT_SUBMISSION_FORM'),
  SAVE_FOR_LATER_SUBMISSION_FORM: type('dspace/submission/SAVE_FOR_LATER_SUBMISSION_FORM'),
  SAVE_FOR_LATER_SUBMISSION_FORM_SUCCESS: type('dspace/submission/SAVE_FOR_LATER_SUBMISSION_FORM_SUCCESS'),
  SAVE_FOR_LATER_SUBMISSION_FORM_ERROR: type('dspace/submission/SAVE_FOR_LATER_SUBMISSION_FORM_ERROR'),
  SAVE_SUBMISSION_FORM: type('dspace/submission/SAVE_SUBMISSION_FORM'),
  SAVE_SUBMISSION_FORM_SUCCESS: type('dspace/submission/SAVE_SUBMISSION_FORM_SUCCESS'),
  SAVE_SUBMISSION_FORM_ERROR: type('dspace/submission/SAVE_SUBMISSION_FORM_ERROR'),
  SAVE_SUBMISSION_SECTION_FORM: type('dspace/submission/SAVE_SUBMISSION_SECTION_FORM'),
  SAVE_SUBMISSION_SECTION_FORM_SUCCESS: type('dspace/submission/SAVE_SUBMISSION_SECTION_FORM_SUCCESS'),
  SAVE_SUBMISSION_SECTION_FORM_ERROR: type('dspace/submission/SAVE_SUBMISSION_SECTION_FORM_ERROR'),
  COMPLETE_SAVE_SUBMISSION_FORM: type('dspace/submission/COMPLETE_SAVE_SUBMISSION_FORM'),
  CHANGE_SUBMISSION_COLLECTION: type('dspace/submission/CHANGE_SUBMISSION_COLLECTION'),
  SET_ACTIVE_SECTION: type('dspace/submission/SET_ACTIVE_SECTION'),
  ENABLE_SECTION: type('dspace/submission/ENABLE_SECTION'),
  DISABLE_SECTION: type('dspace/submission/DISABLE_SECTION'),
  SECTION_STATUS_CHANGE: type('dspace/submission/SECTION_STATUS_CHANGE'),
  SECTION_LOADING_STATUS_CHANGE: type('dspace/submission/SECTION_LOADING_STATUS_CHANGE'),
  UPLOAD_SECTION_DATA: type('dspace/submission/UPLOAD_SECTION_DATA'),
  SAVE_AND_DEPOSIT_SUBMISSION: type('dspace/submission/SAVE_AND_DEPOSIT_SUBMISSION'),
  DEPOSIT_SUBMISSION: type('dspace/submission/DEPOSIT_SUBMISSION'),
  DEPOSIT_SUBMISSION_SUCCESS: type('dspace/submission/DEPOSIT_SUBMISSION_SUCCESS'),
  DEPOSIT_SUBMISSION_ERROR: type('dspace/submission/DEPOSIT_SUBMISSION_ERROR'),
  SET_WORKSPACE_DUPLICATION: type('/sections/deduplication/SET_WORKSPACE_DUPLICATION'),
  SET_WORKSPACE_DUPLICATION_SUCCESS: type('/sections/deduplication/SET_WORKSPACE_DUPLICATION_SUCCESS'),
  SET_WORKSPACE_DUPLICATION_ERROR: type('/sections/deduplication/SET_WORKSPACE_DUPLICATION_ERROR'),
  SET_WORKFLOW_DUPLICATION: type('/sections/deduplication/SET_WORKFLOW_DUPLICATION'),
  SET_WORKFLOW_DUPLICATION_SUCCESS: type('/sections/deduplication/SET_WORKFLOW_DUPLICATION_SUCCESS'),
  SET_WORKFLOW_DUPLICATION_ERROR: type('/sections/deduplication/SET_WORKFLOW_DUPLICATION_ERROR'),

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
 * Insert a new error of type SubmissionSectionError into the given section
 * @param {string} submissionId
 * @param {string} sectionId
 * @param {SubmissionSectionError} error
 */
export class InertSectionErrorsAction implements Action {
  type: string = SubmissionObjectActionTypes.INSERT_ERRORS;
  payload: {
    submissionId: string;
    sectionId: string;
    error: SubmissionSectionError | SubmissionSectionError[];
  };

  constructor(submissionId: string, sectionId: string, error: SubmissionSectionError | SubmissionSectionError[]) {
    this.payload = { submissionId, sectionId, error };
  }
}

/**
 * Delete a SubmissionSectionError from the given section
 * @param {string} submissionId
 * @param {string} sectionId
 * @param {string | SubmissionSectionError} error
 */
export class DeleteSectionErrorsAction implements Action {
  type: string = SubmissionObjectActionTypes.DELETE_ERRORS;
  payload: {
    submissionId: string;
    sectionId: string;
    error: string | SubmissionSectionError | SubmissionSectionError[];
  };

  constructor(submissionId: string, sectionId: string, error: string | SubmissionSectionError | SubmissionSectionError[]) {
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
    data: WorkspaceitemSectionDataType;
    errors: SubmissionSectionError[];
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
   * @param data
   *    the section's data
   * @param errors
   *    the section's errors
   */
  constructor(submissionId: string,
              sectionId: string,
              sectionViewIndex: number,
              data: WorkspaceitemSectionDataType,
              errors: SubmissionSectionError[]) {
    this.payload = { submissionId, sectionId, sectionViewIndex, data, errors };
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

export class UpdateSectionDataAction implements Action {
  type = SubmissionObjectActionTypes.UPLOAD_SECTION_DATA;
  payload: {
    submissionId: string;
    sectionId: string;
    data: WorkspaceitemSectionDataType;
    errors: SubmissionSectionError[];
  };

  /**
   * Create a new EnableSectionAction
   *
   * @param submissionId
   *    the submission's ID to remove
   * @param sectionId
   *    the section's ID to add
   * @param data
   *    the section's data
   * @param errors
   *    the section's errors
   */
  constructor(submissionId: string,
              sectionId: string,
              data: WorkspaceitemSectionDataType,
              errors: SubmissionSectionError[]) {
    this.payload = { submissionId, sectionId, data, errors };
  }
}

export class InitSubmissionFormAction implements Action {
  type = SubmissionObjectActionTypes.INIT_SUBMISSION_FORM;
  payload: {
    collectionId: string;
    definitionId: string;
    submissionId: string;
    selfUrl: string;
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
  constructor(collectionId: string, definitionId: string, submissionId: string, selfUrl: string, sections: WorkspaceitemSectionsObject) {
    this.payload = { collectionId, definitionId, submissionId, selfUrl, sections };
  }
}

// Submission actions

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
    selfUrl: string;
    sections: WorkspaceitemSectionsObject;
    submissionDefinition: SubmissionDefinitionsModel;
  };

  /**
   * Create a new LoadSubmissionFormAction
   *
   * @param collectionId
   *    the collection's Id where to deposit
   * @param submissionId
   *    the submission's ID
   * @param selfUrl
   *    the submission object url
   * @param sections
   *    the submission's sections
   */
  constructor(collectionId: string, submissionId: string, selfUrl: string, sections: WorkspaceitemSectionsObject, submissionDefinition: SubmissionDefinitionsModel) {
    this.payload = { collectionId, submissionId, selfUrl, sections, submissionDefinition };
  }
}

export class SaveForLaterSubmissionFormAction implements Action {
  type = SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM;
  payload: {
    submissionId: string;
  };

  /**
   * Create a new SaveForLaterSubmissionFormAction
   *
   * @param submissionId
   *    the submission's ID
   */
  constructor(submissionId: string) {
    this.payload = { submissionId };
  }
}

export class SaveForLaterSubmissionFormSuccessAction implements Action {
  type = SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM_SUCCESS;
  payload: {
    submissionId: string;
    submissionObject: SubmissionObject[];
  };

  /**
   * Create a new SaveForLaterSubmissionFormSuccessAction
   *
   * @param submissionId
   *    the submission's ID
   * @param submissionObjects
   *    the submission's Object
   */
  constructor(submissionId: string, submissionObject: SubmissionObject[]) {
    this.payload = { submissionId, submissionObject };
  }
}

export class SaveForLaterSubmissionFormErrorAction implements Action {
  type = SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM_ERROR;
  payload: {
    submissionId: string;
  };

  /**
   * Create a new SaveForLaterSubmissionFormErrorAction
   *
   * @param submissionId
   *    the submission's ID
   */
  constructor(submissionId: string) {
    this.payload = { submissionId };
  }
}

export class SaveSubmissionFormAction implements Action {
  type = SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM;
  payload: {
    submissionId: string;
  };

  /**
   * Create a new SaveSubmissionFormAction
   *
   * @param submissionId
   *    the submission's ID
   */
  constructor(submissionId: string) {
    this.payload = { submissionId };
  }
}

export class SaveSubmissionFormSuccessAction implements Action {
  type = SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_SUCCESS;
  payload: {
    submissionId: string;
    submissionObject: SubmissionObject[];
  };

  /**
   * Create a new SaveSubmissionFormSuccessAction
   *
   * @param submissionId
   *    the submission's ID
   * @param submissionObjects
   *    the submission's Object
   */
  constructor(submissionId: string, submissionObject: SubmissionObject[]) {
    this.payload = { submissionId, submissionObject };
  }
}

export class SaveSubmissionFormErrorAction implements Action {
  type = SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_ERROR;
  payload: {
    submissionId: string;
  };

  /**
   * Create a new SaveSubmissionFormErrorAction
   *
   * @param submissionId
   *    the submission's ID
   */
  constructor(submissionId: string) {
    this.payload = { submissionId };
  }
}

export class SaveSubmissionSectionFormAction implements Action {
  type = SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM;
  payload: {
    submissionId: string;
    sectionId: string;
  };

  /**
   * Create a new SaveSubmissionSectionFormAction
   *
   * @param submissionId
   *    the submission's ID
   * @param sectionId
   *    the section's ID
   */
  constructor(submissionId: string, sectionId: string) {
    this.payload = { submissionId, sectionId };
  }
}

export class SaveSubmissionSectionFormSuccessAction implements Action {
  type = SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM_SUCCESS;
  payload: {
    submissionId: string;
    submissionObject: SubmissionObject[];
  };

  /**
   * Create a new SaveSubmissionSectionFormSuccessAction
   *
   * @param submissionId
   *    the submission's ID
   * @param submissionObjects
   *    the submission's Object
   */
  constructor(submissionId: string, submissionObject: SubmissionObject[]) {
    this.payload = { submissionId, submissionObject };
  }
}

export class SaveSubmissionSectionFormErrorAction implements Action {
  type = SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM_ERROR;
  payload: {
    submissionId: string;
  };

  /**
   * Create a new SaveSubmissionFormErrorAction
   *
   * @param submissionId
   *    the submission's ID
   */
  constructor(submissionId: string) {
    this.payload = { submissionId };
  }
}

export class CompleteSaveSubmissionFormAction implements Action {
  type = SubmissionObjectActionTypes.COMPLETE_SAVE_SUBMISSION_FORM;
  payload: {
    submissionId: string;
  };

  /**
   * Create a new CompleteSaveSubmissionFormAction
   *
   * @param submissionId
   *    the submission's ID
   */
  constructor(submissionId: string) {
    this.payload = { submissionId };
  }
}

export class ResetSubmissionFormAction implements Action {
  type = SubmissionObjectActionTypes.RESET_SUBMISSION_FORM;
  payload: {
    collectionId: string;
    submissionId: string;
    selfUrl: string;
    sections: WorkspaceitemSectionsObject;
    submissionDefinition: SubmissionDefinitionsModel;
  };

  /**
   * Create a new LoadSubmissionFormAction
   *
   * @param collectionId
   *    the collection's Id where to deposit
   * @param submissionId
   *    the submission's ID
   * @param selfUrl
   *    the submission object url
   * @param sections
   *    the submission's sections
   * @param submissionDefinition
   *    the submission's form definition
   */
  constructor(collectionId: string, submissionId: string, selfUrl: string, sections: WorkspaceitemSectionsObject, submissionDefinition: SubmissionDefinitionsModel) {
    this.payload = { collectionId, submissionId, selfUrl, sections, submissionDefinition };
  }
}

export class CancelSubmissionFormAction implements Action {
  type = SubmissionObjectActionTypes.CANCEL_SUBMISSION_FORM;
}

export class ChangeSubmissionCollectionAction implements Action {
  type = SubmissionObjectActionTypes.CHANGE_SUBMISSION_COLLECTION;
  payload: {
    submissionId: string;
    collectionId: string;
  };

  /**
   * Create a new ChangeSubmissionCollectionAction
   *
   * @param collectionId
   *    the new collection's ID
   */
  constructor(submissionId: string, collectionId: string) {
    this.payload = { submissionId, collectionId };
  }
}

export class SaveAndDepositSubmissionAction implements Action {
  type = SubmissionObjectActionTypes.SAVE_AND_DEPOSIT_SUBMISSION;
  payload: {
    submissionId: string;
  };

  /**
   * Create a new SaveAndDepositSubmissionAction
   *
   * @param submissionId
   *    the submission's ID to deposit
   */
  constructor(submissionId: string) {
    this.payload = { submissionId };
  }
}

export class DepositSubmissionAction implements Action {
  type = SubmissionObjectActionTypes.DEPOSIT_SUBMISSION;
  payload: {
    submissionId: string;
  };

  /**
   * Create a new DepositSubmissionFormAction
   *
   * @param submissionId
   *    the submission's ID to deposit
   */
  constructor(submissionId: string) {
    this.payload = { submissionId };
  }
}

export class DepositSubmissionSuccessAction implements Action {
  type = SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_SUCCESS;
  payload: {
    submissionId: string;
  };

  /**
   * Create a new DepositSubmissionSuccessAction
   *
   * @param submissionId
   *    the submission's ID to deposit
   */
  constructor(submissionId: string) {
    this.payload = { submissionId };
  }
}

export class DepositSubmissionErrorAction implements Action {
  type = SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_ERROR;
  payload: {
    submissionId: string;
  };

  /**
   * Create a new DepositSubmissionErrorAction
   *
   * @param submissionId
   *    the submission's ID to deposit
   */
  constructor(submissionId: string) {
    this.payload = { submissionId };
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

export class SectionLoadingStatusChangeAction implements Action {
  type = SubmissionObjectActionTypes.SECTION_LOADING_STATUS_CHANGE;
  payload: {
    submissionId: string;
    sectionId: string;
    loading: boolean
  };

  /**
   * Change the section loading status
   *
   * @param submissionId
   *    the submission's ID
   * @param sectionId
   *    the section's ID to change
   * @param loading
   *    the section loading status (true if is loading)
   */
  constructor(submissionId: string, sectionId: string, loading: boolean) {
    this.payload = { submissionId, sectionId, loading };
  }
}

export class SetActiveSectionAction implements Action {
  type = SubmissionObjectActionTypes.SET_ACTIVE_SECTION;
  payload: {
    submissionId: string;
    sectionId: string;
  };

  /**
   * Create a new SetActiveSectionAction
   *
   * @param submissionId
   *    the submission's ID
   * @param sectionId
   *    the section's ID to active
   */
  constructor(submissionId: string, sectionId: string) {
    this.payload = { submissionId, sectionId };
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

export class SetWorkspaceDuplicatedAction implements Action {
  type = SubmissionObjectActionTypes.SET_WORKSPACE_DUPLICATION;
  payload: {
    index: number;
    decision: string;
    note?: string
  };

  /**
   * Create a new SetWorkspaceDuplicatedAction
   *
   * @param index
   *    the index in matches array
   * @param decision
   *    the submitter's decision ('verify'|'reject'|null)
   * @param note
   *    the submitter's note, for 'verify' decision only
   */
  constructor(payload: any) {
    this.payload = payload;
  }
}

export class SetWorkspaceDuplicatedSuccessAction implements Action {
  type = SubmissionObjectActionTypes.SET_WORKSPACE_DUPLICATION_SUCCESS;
  payload: {
    index: number;
    decision: string;
    note?: string
  };

  /**
   * Create a new SetWorkspaceDuplicatedSuccessAction
   *
   * @param index
   *    the index in matches array
   * @param decision
   *    the submitter's decision ('verify'|'reject'|null)
   * @param note
   *    the submitter's note, for 'verify' decision only
   */
  constructor(payload: any) {
    this.payload = payload;
  }
}

export class SetWorkspaceDuplicatedErrorAction implements Action {
  type = SubmissionObjectActionTypes.SET_WORKSPACE_DUPLICATION_ERROR;
  payload: {
    index: number;
  };

  /**
   * Create a new SetWorkspaceDuplicatedErrorAction
   *
   * @param index
   *    the index in matches array
   */
  constructor(index: number) {
    this.payload = { index };
  }
}

export class SetWorkflowDuplicatedAction implements Action {
  type = SubmissionObjectActionTypes.SET_WORKFLOW_DUPLICATION;
  payload: {
    index: number;
    decision: string;
    note?: string
  };

  /**
   * Create a new SetWorkflowDuplicatedAction
   *
   * @param index
   *    the index in matches array
   * @param decision
   *    the controller's decision ('verify'|'reject'|null)
   * @param note
   *    the controller's note, for 'verify' decision only
   */
  constructor(payload: any) {
    this.payload = payload;
  }
}

export class SetWorkflowDuplicatedSuccessAction implements Action {
  type = SubmissionObjectActionTypes.SET_WORKFLOW_DUPLICATION_SUCCESS;
  payload: {
    index: number;
    decision: string;
    note?: string
  };

  /**
   * Create a new SetWorkflowDuplicatedSuccessAction
   *
   * @param index
   *    the index in matches array
   * @param decision
   *    the controller's decision ('verify'|'reject'|null)
   * @param note
   *    the controller's note, for 'verify' decision only
   */
  constructor(payload: any) {
    this.payload = payload;
  }
}

export class SetWorkflowDuplicatedErrorAction implements Action {
  type = SubmissionObjectActionTypes.SET_WORKFLOW_DUPLICATION_ERROR;
  payload: {
    index: number;
  };

  /**
   * Create a new SetWorkflowDuplicatedErrorAction
   *
   * @param index
   *    the index in matches array
   */
  constructor(index: number) {
    this.payload = { index };
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
  | CancelSubmissionFormAction
  | InitSubmissionFormAction
  | CompleteInitSubmissionFormAction
  | ChangeSubmissionCollectionAction
  | SaveAndDepositSubmissionAction
  | DepositSubmissionAction
  | DepositSubmissionSuccessAction
  | DepositSubmissionErrorAction
  | SectionStatusChangeAction
  | NewUploadedFileAction
  | EditFileDataAction
  | DeleteUploadedFileAction
  | InertSectionErrorsAction
  | DeleteSectionErrorsAction
  | ClearSectionErrorsAction
  | UpdateSectionDataAction
  | SaveForLaterSubmissionFormAction
  | SaveForLaterSubmissionFormSuccessAction
  | SaveForLaterSubmissionFormErrorAction
  | SaveSubmissionFormAction
  | SaveSubmissionFormSuccessAction
  | SaveSubmissionFormErrorAction
  | SaveSubmissionSectionFormAction
  | SaveSubmissionSectionFormSuccessAction
  | SaveSubmissionSectionFormErrorAction
  | CompleteSaveSubmissionFormAction
  | SetActiveSectionAction
  | SetWorkspaceDuplicatedAction
  | SetWorkspaceDuplicatedSuccessAction
  | SetWorkspaceDuplicatedErrorAction
  | SetWorkflowDuplicatedAction
  | SetWorkflowDuplicatedSuccessAction
  | SetWorkflowDuplicatedErrorAction;
