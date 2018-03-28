import { hasValue, isNotEmpty, isNotNull, isNotUndefined } from '../../shared/empty.util';
import { findKey, uniqWith, isEqual, differenceWith } from 'lodash';

import {
  CompleteInitSubmissionFormAction,
  DeleteUploadedFileAction,
  DisableSectionAction, EditFileDataAction,
  EnableSectionAction, NewUploadedFileAction,
  LoadSubmissionFormAction, SectionStatusChangeAction,
  SubmissionObjectAction,
  SubmissionObjectActionTypes, ClearSectionErrorsAction, InertSectionErrorsAction,
  DeleteSectionErrorsAction, ResetSubmissionFormAction, UpdateSectionDataAction, SaveSubmissionFormAction,
  CompleteSaveSubmissionFormAction, SetActiveSectionAction, SaveSubmissionSectionFormAction,
  DepositSubmissionAction, DepositSubmissionSuccessAction, DepositSubmissionErrorAction,
  ChangeSubmissionCollectionAction, SaveSubmissionFormSuccessAction, SaveSubmissionFormErrorAction,
  SaveSubmissionSectionFormSuccessAction, SaveSubmissionSectionFormErrorAction, SetWorkspaceDuplicatedAction,
  SetWorkflowDuplicatedAction
} from './submission-objects.actions';
import { deleteProperty } from '../../shared/object.util';
import { WorkspaceitemSectionDataType } from '../../core/submission/models/workspaceitem-sections.model';
import { WorkspaceitemSectionUploadObject } from '../../core/submission/models/workspaceitem-section-upload.model';

export interface SubmissionSectionObject {
  sectionViewIndex: number;
  data: WorkspaceitemSectionDataType;
  errors: SubmissionSectionError[];
  isLoading: boolean;
  isValid: boolean;
}

export interface SubmissionSectionError {
  path: string;
  message: string;
}

export interface SubmissionSectionEntry {
  [sectionId: string]: SubmissionSectionObject;
}

export interface SubmissionObjectEntry {
  collection?: string,
  selfUrl?: string;
  activeSection?: string;
  sections?: SubmissionSectionEntry;
  isLoading?: boolean;
  savePending?: boolean;
  depositPending?: boolean;
}

/**
 * The Submission State
 *
 * Consists of a map with submission's ID as key,
 * and SubmissionObjectEntries as values
 */
export interface SubmissionObjectState {
  [submissionId: string]: SubmissionObjectEntry;
}

const initialState: SubmissionObjectState = Object.create({});

export function submissionObjectReducer(state = initialState, action: SubmissionObjectAction): SubmissionObjectState {
  switch (action.type) {

    // submission form actions
    case SubmissionObjectActionTypes.INIT_SUBMISSION_FORM: {
      return state;
    }

    case SubmissionObjectActionTypes.COMPLETE_INIT_SUBMISSION_FORM: {
      return completeInit(state, action as CompleteInitSubmissionFormAction);
    }

    case SubmissionObjectActionTypes.LOAD_SUBMISSION_FORM: {
      return initSubmission(state, action as LoadSubmissionFormAction);
    }

    case SubmissionObjectActionTypes.RESET_SUBMISSION_FORM: {
      return state;
    }

    case SubmissionObjectActionTypes.CANCEL_SUBMISSION_FORM: {
      return initialState;
    }

    case SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM:
    case SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM:
    case SubmissionObjectActionTypes.SAVE_AND_DEPOSIT_SUBMISSION: {
      return saveSubmission(state, action as SaveSubmissionFormAction);
    }

    case SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_SUCCESS:
    case SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM_SUCCESS: {
      return completeSave(state, action as SaveSubmissionFormSuccessAction);
    }

    case SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_ERROR:
    case SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM_ERROR: {
      return completeSave(state, action as SaveSubmissionFormErrorAction);
    }

    case SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM: {
      return saveSubmission(state, action as SaveSubmissionSectionFormAction);
    }

    case SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM_SUCCESS: {
      return completeSave(state, action as SaveSubmissionSectionFormSuccessAction);
    }

    case SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM_ERROR: {
      return completeSave(state, action as SaveSubmissionSectionFormErrorAction);
    }

    case SubmissionObjectActionTypes.CHANGE_SUBMISSION_COLLECTION: {
      return changeCollection(state, action as ChangeSubmissionCollectionAction);
    }

    case SubmissionObjectActionTypes.COMPLETE_SAVE_SUBMISSION_FORM: {
      return completeSave(state, action as CompleteSaveSubmissionFormAction);
    }

    case SubmissionObjectActionTypes.DEPOSIT_SUBMISSION: {
      return startDeposit(state, action as DepositSubmissionAction);
    }

    case SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_SUCCESS: {
      return Object.create({});
    }

    case SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_ERROR: {
      return endDeposit(state, action as DepositSubmissionAction);
    }

    case SubmissionObjectActionTypes.SET_ACTIVE_SECTION: {
      return setActiveSection(state, action as SetActiveSectionAction);
    }

    // Section actions
    case SubmissionObjectActionTypes.ENABLE_SECTION: {
      return enableSection(state, action as EnableSectionAction);
    }

    case SubmissionObjectActionTypes.UPLOAD_SECTION_DATA: {
      return updateSectionData(state, action as UpdateSectionDataAction);
    }

    case SubmissionObjectActionTypes.DISABLE_SECTION: {
      return disableSection(state, action as DisableSectionAction);
    }

    case SubmissionObjectActionTypes.SECTION_STATUS_CHANGE: {
      return setIsValid(state, action as SectionStatusChangeAction);
    }

    // Files actions
    case SubmissionObjectActionTypes.NEW_FILE: {
      return newFile(state, action as NewUploadedFileAction);
    }

    case SubmissionObjectActionTypes.EDIT_FILE_DATA: {
      return editFileData(state, action as EditFileDataAction);
    }

    case SubmissionObjectActionTypes.DELETE_FILE: {
      return deleteFile(state, action as DeleteUploadedFileAction);
    }

    // deduplication
    case SubmissionObjectActionTypes.SET_WORKSPACE_DUPLICATION: {
      return updateDeduplication(state, action as SetWorkspaceDuplicatedAction);
    }

    case SubmissionObjectActionTypes.SET_WORKFLOW_DUPLICATION: {
      return updateDeduplication(state, action as SetWorkflowDuplicatedAction);
    }

    // errors actions
    case SubmissionObjectActionTypes.INSERT_ERRORS: {
      return insertError(state, action as InertSectionErrorsAction);
    }

    case SubmissionObjectActionTypes.DELETE_ERRORS: {
      return removeError(state, action as DeleteSectionErrorsAction);
    }

    case SubmissionObjectActionTypes.CLEAR_ERRORS: {
      return clearErrorsFromSection(state, action as ClearSectionErrorsAction);
    }

    default: {
      return state;
    }
  }
}

// ------ Submission error functions ------ //

const removeError = (state: SubmissionObjectState, action: DeleteSectionErrorsAction): SubmissionObjectState => {
  const { submissionId, sectionId, error } = action.payload;

  if (hasValue(state[ submissionId ].sections[ sectionId ])) {
    let errors = state[ submissionId ].sections[ sectionId ].errors.filter((currentError) => {
      return currentError.message !== error && !isEqual(currentError, error);
    });

    if (action.payload.error instanceof Array) {
      errors = differenceWith(errors, action.payload.error, isEqual);
    }

    return Object.assign({}, state, {
      [ submissionId ]: Object.assign({}, state[ submissionId ], {
        activeSection: state[ action.payload.submissionId ].activeSection,
        sections: Object.assign({}, state[ submissionId ].sections, {
          [ sectionId ]: {
            sectionViewIndex: state[ submissionId ].sections[ sectionId ].sectionViewIndex,
            data: state[ submissionId ].sections[ sectionId ].data,
            isValid: state[ submissionId ].sections[ sectionId ].isValid,
            errors,
          }
        }),
        isLoading: state[ action.payload.submissionId ].isLoading,
        savePending: state[ action.payload.submissionId ].savePending,
      })
    });
  } else {
    return state;
  }
};

const insertError = (state: SubmissionObjectState, action: InertSectionErrorsAction): SubmissionObjectState => {
  const { submissionId, sectionId, error } = action.payload;

  if (hasValue(state[ submissionId ].sections[ sectionId ])) {
    const errors = uniqWith(state[ submissionId ].sections[ sectionId ].errors.concat(error), isEqual);

    return Object.assign({}, state, {
      [ submissionId ]: Object.assign({}, state[ submissionId ], {
        activeSection: state[ action.payload.submissionId ].activeSection,
        sections: Object.assign({}, state[ submissionId ].sections, {
          [ sectionId ]: {
            sectionViewIndex: state[ submissionId ].sections[ sectionId ].sectionViewIndex,
            data: state[ submissionId ].sections[ sectionId ].data,
            isValid: state[ submissionId ].sections[ sectionId ].isValid,
            errors,
          }
        }),
        isLoading: state[ action.payload.submissionId ].isLoading,
        savePending: state[ action.payload.submissionId ].savePending,
      })
    });
  } else {
    return state;
  }
};

const clearErrorsFromSection = (state: SubmissionObjectState, action: ClearSectionErrorsAction): SubmissionObjectState => {
  const { submissionId, sectionId } = action.payload;

  if (hasValue(state[ submissionId ].sections[ sectionId ])) {
    const errors = []; // clear the errors

    return Object.assign({}, state, {
      [ submissionId ]: Object.assign({}, state[ submissionId ], {
        activeSection: state[ action.payload.submissionId ].activeSection,
        sections: Object.assign({}, state[ submissionId ].sections, {
          [ sectionId ]: {
            sectionViewIndex: state[ submissionId ].sections[ sectionId ].sectionViewIndex,
            data: state[ submissionId ].sections[ sectionId ].data,
            isValid: state[ submissionId ].sections[ sectionId ].isValid,
            errors,
          }
        }),
        isLoading: state[ action.payload.submissionId ].isLoading,
        savePending: state[ action.payload.submissionId ].savePending,
      })
    });
  } else {
    return state;
  }
};

// ------ Submission functions ------ //

/**
 * Init a SubmissionObjectState.
 *
 * @param state
 *    the current state
 * @param action
 *    an LoadSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function initSubmission(state: SubmissionObjectState, action: LoadSubmissionFormAction | ResetSubmissionFormAction): SubmissionObjectState {

  const newState = Object.assign({}, state);
  newState[ action.payload.submissionId ] = {
    collection: action.payload.collectionId,
    selfUrl: action.payload.selfUrl,
    activeSection: null,
    sections: Object.create(null),
    isLoading: true,
    savePending: false
  };
  return newState;
}

/**
 * Set a section enabled.
 *
 * @param state
 *    the current state
 * @param action
 *    an CompleteInitSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function completeInit(state: SubmissionObjectState, action: CompleteInitSubmissionFormAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        activeSection: state[ action.payload.submissionId ].activeSection,
        sections: state[ action.payload.submissionId ].sections,
        isLoading: false,
        savePending: false,
        depositPending: false,
      })
    });
  } else {
    return state;
  }
}

/**
 * Set submission save flag to true
 *
 * @param state
 *    the current state
 * @param action
 *    an SaveSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the flag set to true.
 */
function saveSubmission(state: SubmissionObjectState, action: SaveSubmissionFormAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        activeSection: state[ action.payload.submissionId ].activeSection,
        sections: state[ action.payload.submissionId ].sections,
        isLoading: state[ action.payload.submissionId ].isLoading,
        savePending: true,
      })
    });
  } else {
    return state;
  }
}

/**
 * Set submission save flag to false.
 *
 * @param state
 *    the current state
 * @param action
 *    an CompleteSaveSubmissionFormAction | SaveSubmissionFormSuccessAction | SaveSubmissionFormErrorAction
 * @return SubmissionObjectState
 *    the new state, with the flag set to false.
 */
function completeSave(state: SubmissionObjectState,
                      action: CompleteSaveSubmissionFormAction
                        | SaveSubmissionFormSuccessAction
                        | SaveSubmissionFormErrorAction
                        | SaveSubmissionSectionFormSuccessAction
                        | SaveSubmissionSectionFormErrorAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        savePending: false,
      })
    });
  } else {
    return state;
  }
}

/**
 * Set deposit flag to true
 *
 * @param state
 *    the current state
 * @param action
 *    an DepositSubmissionAction
 * @return SubmissionObjectState
 *    the new state, with the deposit flag changed.
 */
function startDeposit(state: SubmissionObjectState, action: DepositSubmissionAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        savePending: false,
        depositPending: true,
      })
    });
  } else {
    return state;
  }
}

/**
 * Set deposit flag to false
 *
 * @param state
 *    the current state
 * @param action
 *    an DepositSubmissionSuccessAction or DepositSubmissionErrorAction
 * @return SubmissionObjectState
 *    the new state, with the deposit flag changed.
 */
function endDeposit(state: SubmissionObjectState, action: DepositSubmissionSuccessAction | DepositSubmissionErrorAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        depositPending: false,
      })
    });
  } else {
    return state;
  }
}

/**
 * Init a SubmissionObjectState.
 *
 * @param state
 *    the current state
 * @param action
 *    an LoadSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function changeCollection(state: SubmissionObjectState, action: ChangeSubmissionCollectionAction): SubmissionObjectState {
  return Object.assign({}, state, {
    [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
      collection: action.payload.collectionId
    })
  });
}

// ------ Section functions ------ //

/**
 * Set submission active section.
 *
 * @param state
 *    the current state
 * @param action
 *    an SetActiveSectionAction
 * @return SubmissionObjectState
 *    the new state, with the active section.
 */
function setActiveSection(state: SubmissionObjectState, action: SetActiveSectionAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        activeSection: action.payload.sectionId,
        sections: state[ action.payload.submissionId ].sections,
        isLoading: state[ action.payload.submissionId ].isLoading,
        savePending: state[ action.payload.submissionId ].savePending,
      })
    });
  } else {
    return state;
  }
}

/**
 * Set a section enabled.
 *
 * @param state
 *    the current state
 * @param action
 *    an EnableSectionAction
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function enableSection(state: SubmissionObjectState, action: EnableSectionAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        activeSection: state[ action.payload.submissionId ].activeSection,
        sections: Object.assign({}, state[ action.payload.submissionId ].sections, {
          [ action.payload.sectionId ]: {
            sectionViewIndex: action.payload.sectionViewIndex,
            data: action.payload.data,
            isValid: false,
            errors: []
          }
        }),
        isLoading: state[ action.payload.submissionId ].isLoading,
        savePending: state[ action.payload.submissionId ].savePending,
      })
    });
  } else {
    return state;
  }
}

/**
 * Update section's data.
 *
 * @param state
 *    the current state
 * @param action
 *    an UpdateSectionDataAction
 * @return SubmissionObjectState
 *    the new state, with the section's data updated.
 */
function updateSectionData(state: SubmissionObjectState, action: UpdateSectionDataAction): SubmissionObjectState {
  if (isNotEmpty(state[ action.payload.submissionId ])
      && isNotEmpty(state[ action.payload.submissionId ].sections[ action.payload.sectionId])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        activeSection: state[ action.payload.submissionId ].activeSection,
        sections: Object.assign({}, state[ action.payload.submissionId ].sections, {
          [ action.payload.sectionId ]: {
            sectionViewIndex: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].sectionViewIndex,
            data: action.payload.data,
            isValid: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].isValid,
            errors: action.payload.errors
          }
        }),
        isLoading: state[ action.payload.submissionId ].isLoading,
        savePending: state[ action.payload.submissionId ].savePending,
      })
    });
  } else {
    return state;
  }
}

/**
 * Set a section disabled.
 *
 * @param state
 *    the current state
 * @param action
 *    an DisableSectionAction
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function disableSection(state: SubmissionObjectState, action: DisableSectionAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ].sections[ action.payload.sectionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        activeSection: state[ action.payload.submissionId ].activeSection,
        sections: deleteProperty(state[ action.payload.submissionId ].sections, action.payload.sectionId),
        isLoading: state[ action.payload.submissionId ].isLoading,
        savePending: state[ action.payload.submissionId ].savePending,
      })
    });
  } else {
    return state;
  }
}

/**
 * Set the section validity.
 *
 * @param state
 *    the current state
 * @param action
 *    an LoadSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the section new validity status.
 */
function setIsValid(state: SubmissionObjectState, action: SectionStatusChangeAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ].sections[ action.payload.sectionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        activeSection: state[ action.payload.submissionId ].activeSection,
        sections: Object.assign({}, state[ action.payload.submissionId ].sections,
          Object.assign({}, {
            [ action.payload.sectionId ]: {
              sectionViewIndex: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].sectionViewIndex,
              data: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data,
              isValid: action.payload.status,
              errors: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].errors,
            }
          })
        ),
        isLoading: state[ action.payload.submissionId ].isLoading,
        savePending: state[ action.payload.submissionId ].savePending,
      })
    });
  } else {
    return state;
  }
}

// ------ Upload file functions ------ //

/**
 * Set a new bitstream.
 *
 * @param state
 *    the current state
 * @param action
 *    a NewUploadedFileAction action
 * @return SubmissionObjectState
 *    the new state, with the new bitstream.
 */
function newFile(state: SubmissionObjectState, action: NewUploadedFileAction): SubmissionObjectState {
  const filesData = state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data as WorkspaceitemSectionUploadObject;
  if (isNotUndefined(filesData.files)
    && !hasValue(filesData.files[ action.payload.fileId ])) {
    const newData = [];
    newData[ action.payload.fileId ] = action.payload.data;
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        activeSection: state[ action.payload.submissionId ].activeSection,
        sections: Object.assign({}, state[ action.payload.submissionId ].sections,
          Object.assign({}, {
              [ action.payload.sectionId ]: {
                sectionViewIndex: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].sectionViewIndex,
                data: Object.assign({}, state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data, {
                  files: Object.assign({},
                    filesData.files,
                    newData)
                }),
                isValid: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].isValid,
                errors: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].errors
              }
            }
          )
        ),
        isLoading: state[ action.payload.submissionId ].isLoading,
        savePending: state[ action.payload.submissionId ].savePending,
      })
    });
  } else {
    const newData = [];
    newData[ action.payload.fileId ] = action.payload.data;
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        activeSection: state[ action.payload.submissionId ].activeSection,
        sections: Object.assign({}, state[ action.payload.submissionId ].sections,
          Object.assign({}, {
            [ action.payload.sectionId ]: {
              sectionViewIndex: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].sectionViewIndex,
              data: Object.assign({}, state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data, {
                files: newData
              }),
              isValid: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].isValid,
              errors: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].errors
            }
          })
        ),
        isLoading: state[ action.payload.submissionId ].isLoading,
        savePending: state[ action.payload.submissionId ].savePending,
      })
    });
  }
}

/**
 * Edit a bitstream.
 *
 * @param state
 *    the current state
 * @param action
 *    a EditFileDataAction action
 * @return SubmissionObjectState
 *    the new state, with the edited bitstream.
 */
function editFileData(state: SubmissionObjectState, action: EditFileDataAction): SubmissionObjectState {
  const filesData = state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data as WorkspaceitemSectionUploadObject;
  if (hasValue(filesData.files)) {
    const fileIndex = findKey(
      filesData.files,
      { uuid: action.payload.fileId });
    if (isNotNull(fileIndex)) {
      return Object.assign({}, state, {
        [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
          activeSection: state[ action.payload.submissionId ].activeSection,
          sections: Object.assign({}, state[ action.payload.submissionId ].sections,
            Object.assign({}, {
                [ action.payload.sectionId ]: {
                  sectionViewIndex: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].sectionViewIndex,
                  data: Object.assign({}, state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data, {
                    files: Object.assign({},
                      filesData.files, {
                        [ fileIndex ]: action.payload.data
                      })
                  }),
                  isValid: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].isValid,
                  errors: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].errors
                }
              }
            )
          ),
          isLoading: state[ action.payload.submissionId ].isLoading,
          savePending: state[ action.payload.submissionId ].savePending,
        })
      });
    }
  }
  return state;
}

/**
 * Delete a bitstream.
 *
 * @param state
 *    the current state
 * @param action
 *    a DeleteUploadedFileAction action
 * @return SubmissionObjectState
 *    the new state, with the bitstream removed.
 */
function deleteFile(state: SubmissionObjectState, action: DeleteUploadedFileAction): SubmissionObjectState {
  const filesData = state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data as WorkspaceitemSectionUploadObject;
  if (hasValue(filesData.files)) {
    const fileIndex = findKey(
      filesData.files,
      {uuid: action.payload.fileId});
    if (isNotNull(fileIndex)) {
      return Object.assign({}, state, {
        [ action.payload.submissionId ]: Object.assign({}, state[action.payload.submissionId], {
          activeSection: state[ action.payload.submissionId ].activeSection,
          sections: Object.assign({}, state[action.payload.submissionId].sections,
            Object.assign({}, {
                [ action.payload.sectionId ]: {
                  sectionViewIndex: state[action.payload.submissionId].sections[action.payload.sectionId].sectionViewIndex,
                  data: Object.assign({}, state[action.payload.submissionId].sections[action.payload.sectionId].data, {
                    files: deleteProperty(filesData.files, fileIndex)
                  }),
                  isValid: state[action.payload.submissionId].sections[action.payload.sectionId].isValid,
                  errors: state[action.payload.submissionId].sections[action.payload.sectionId].errors
                }
              }
            )
          ),
          isLoading: state[action.payload.submissionId].isLoading,
          savePending: state[action.payload.submissionId].savePending,
        })
      });
    }
  }
  return state;
}

/**
 * Update a Workspace deduplication match.
 *
 * @param state
 *    the current state
 * @param action
 *    a SetWorkspaceDuplicatedAction or SetWorkflowDuplicatedAction
 * @return SubmissionObjectState
 *    the new state, with the match parameter changed.
 */
function updateDeduplication(state: SubmissionObjectState, action: SetWorkspaceDuplicatedAction|SetWorkflowDuplicatedAction): SubmissionObjectState {
  const matches = Object.assign([], (state[(action.payload as any).submissionId].sections.deduplication.data as any).matches);
  const newMatch = (action.payload as any).data;
  matches.forEach( (match, i) => {
    if (i === action.payload.index) {
      matches.splice(i, 1, Object.assign({}, match, newMatch));
      return;
    }
  });
  // const updatedMatches = Object.assign({}, matches, newMatch);
  const newState = Object.assign({}, state, {[(action.payload as any).submissionId]: {sections: {deduplication: {data: {matches}}}}});
  return newState;
}
