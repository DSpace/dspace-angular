import { hasValue, isNotEmpty, isNotNull, isUndefined } from '../../shared/empty.util';
import { findKey, uniqWith, isEqual, differenceWith } from 'lodash';

import {
  CompleteInitSubmissionFormAction,
  DeleteUploadedFileAction,
  DisableSectionAction,
  EditFileDataAction,
  EnableSectionAction,
  NewUploadedFileAction,
  InitSubmissionFormAction,
  SectionStatusChangeAction,
  SubmissionObjectAction,
  SubmissionObjectActionTypes,
  InertSectionErrorsAction,
  DeleteSectionErrorsAction,
  ResetSubmissionFormAction,
  UpdateSectionDataAction,
  SaveSubmissionFormAction,
  SetActiveSectionAction,
  SaveSubmissionSectionFormAction,
  DepositSubmissionAction,
  DepositSubmissionSuccessAction,
  DepositSubmissionErrorAction,
  ChangeSubmissionCollectionAction,
  SaveSubmissionFormSuccessAction,
  SaveSubmissionFormErrorAction,
  SaveSubmissionSectionFormSuccessAction,
  SaveSubmissionSectionFormErrorAction,
  InitSectionAction,
  RemoveSectionErrorsAction,
  SaveForLaterSubmissionFormAction,
  SaveAndDepositSubmissionAction,
  SaveForLaterSubmissionFormSuccessAction,
  SaveForLaterSubmissionFormErrorAction,
  SetDuplicateDecisionAction, SetDuplicateDecisionSuccessAction, SetDuplicateDecisionErrorAction
} from './submission-objects.actions';
import { WorkspaceitemSectionDataType } from '../../core/submission/models/workspaceitem-sections.model';
import { WorkspaceitemSectionUploadObject } from '../../core/submission/models/workspaceitem-section-upload.model';
import { SectionsType } from '../sections/sections-type';
import { WorkspaceitemSectionDetectDuplicateObject } from '../../core/submission/models/workspaceitem-section-deduplication.model';

export interface SectionVisibility {
  main: any;
  other: any;
}

export interface SubmissionSectionObject {
  header: string;
  config: string;
  mandatory: boolean;
  sectionType: SectionsType;
  visibility: SectionVisibility;
  collapsed: boolean,
  enabled: boolean;
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
  definition?: string,
  selfUrl?: string;
  activeSection?: string;
  sections?: SubmissionSectionEntry;
  isLoading?: boolean;
  savePending?: boolean;
  saveDecisionPending?: boolean;
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
    case SubmissionObjectActionTypes.COMPLETE_INIT_SUBMISSION_FORM: {
      return completeInit(state, action as CompleteInitSubmissionFormAction);
    }

    case SubmissionObjectActionTypes.INIT_SUBMISSION_FORM: {
      return initSubmission(state, action as InitSubmissionFormAction);
    }

    case SubmissionObjectActionTypes.RESET_SUBMISSION_FORM: {
      return resetSubmission(state, action as ResetSubmissionFormAction);
    }

    case SubmissionObjectActionTypes.CANCEL_SUBMISSION_FORM: {
      return initialState;
    }

    case SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM:
    case SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM:
    case SubmissionObjectActionTypes.SAVE_AND_DEPOSIT_SUBMISSION:
    case SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM: {
      return saveSubmission(state, action as SaveSubmissionFormAction);
    }

    case SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_SUCCESS:
    case SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM_SUCCESS:
    case SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM_SUCCESS:
    case SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_ERROR:
    case SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM_ERROR:
    case SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM_ERROR: {
      return completeSave(state, action as SaveSubmissionFormErrorAction);
    }

    case SubmissionObjectActionTypes.CHANGE_SUBMISSION_COLLECTION: {
      return changeCollection(state, action as ChangeSubmissionCollectionAction);
    }

    case SubmissionObjectActionTypes.DEPOSIT_SUBMISSION: {
      return startDeposit(state, action as DepositSubmissionAction);
    }

    case SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_SUCCESS: {
      return initialState;
    }

    case SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_ERROR: {
      return endDeposit(state, action as DepositSubmissionAction);
    }

    case SubmissionObjectActionTypes.DISCARD_SUBMISSION: {
      return state;
    }

    case SubmissionObjectActionTypes.DISCARD_SUBMISSION_SUCCESS: {
      return initialState;
    }

    case SubmissionObjectActionTypes.DISCARD_SUBMISSION_ERROR: {
      return state;
    }

    case SubmissionObjectActionTypes.SET_ACTIVE_SECTION: {
      return setActiveSection(state, action as SetActiveSectionAction);
    }

    // Section actions

    case SubmissionObjectActionTypes.INIT_SECTION: {
      return initSection(state, action as InitSectionAction);
    }

    case SubmissionObjectActionTypes.ENABLE_SECTION: {
      return changeSectionState(state, action as EnableSectionAction, true);
    }

    case SubmissionObjectActionTypes.UPLOAD_SECTION_DATA: {
      return updateSectionData(state, action as UpdateSectionDataAction);
    }

    case SubmissionObjectActionTypes.DISABLE_SECTION: {
      return changeSectionState(state, action as DisableSectionAction, false);
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

    // errors actions
    case SubmissionObjectActionTypes.ADD_SECTION_ERROR: {
      return addError(state, action as InertSectionErrorsAction);
    }

    case SubmissionObjectActionTypes.DELETE_SECTION_ERROR: {
      return removeError(state, action as DeleteSectionErrorsAction);
    }

    case SubmissionObjectActionTypes.REMOVE_SECTION_ERRORS: {
      return removeSectionErrors(state, action as RemoveSectionErrorsAction);
    }

    // detect duplicate
    case SubmissionObjectActionTypes.SET_DUPLICATE_DECISION: {
      return startSaveDecision(state, action as SetDuplicateDecisionAction);
    }

    case SubmissionObjectActionTypes.SET_DUPLICATE_DECISION_SUCCESS: {
      return setDuplicateMatches(state, action as SetDuplicateDecisionSuccessAction);
    }

    case SubmissionObjectActionTypes.SET_DUPLICATE_DECISION: {
      return endSaveDecision(state, action as SetDuplicateDecisionErrorAction);
    }

    default: {
      return state;
    }
  }
}

// ------ Submission error functions ------ //

const removeError = (state: SubmissionObjectState, action: DeleteSectionErrorsAction): SubmissionObjectState => {
  const { submissionId, sectionId, errors } = action.payload;

  if (hasValue(state[ submissionId ].sections[ sectionId ])) {
    let filteredErrors;

    if (Array.isArray(errors)) {
      filteredErrors = differenceWith(errors, errors, isEqual);
    } else {
      filteredErrors = state[ submissionId ].sections[ sectionId ].errors
        .filter((currentError) => currentError.path !== errors.path || !isEqual(currentError, errors));
    }

    return Object.assign({}, state, {
      [ submissionId ]: Object.assign({}, state[ submissionId ], {
        sections: Object.assign({}, state[ submissionId ].sections, {
          [ sectionId ]: Object.assign({}, state[ submissionId ].sections [ sectionId ], {
            errors: filteredErrors
          })
        })
      })
    });
  } else {
    return state;
  }
};

const addError = (state: SubmissionObjectState, action: InertSectionErrorsAction): SubmissionObjectState => {
  const { submissionId, sectionId, error } = action.payload;

  if (hasValue(state[ submissionId ].sections[ sectionId ])) {
    const errors = uniqWith(state[ submissionId ].sections[ sectionId ].errors.concat(error), isEqual);

    return Object.assign({}, state, {
      [ submissionId ]: Object.assign({}, state[ submissionId ], {
        activeSection: state[ action.payload.submissionId ].activeSection,        sections: Object.assign({}, state[ submissionId ].sections, {
          [ sectionId ]: Object.assign({}, state[ action.payload.submissionId ].sections [ action.payload.sectionId ], {
            errors
          })
        }),
      })
    });
  } else {
    return state;
  }
};

/**
 * Remove all section's errors.
 *
 * @param state
 *    the current state
 * @param action
 *    an RemoveSectionErrorsAction
 * @return SubmissionObjectState
 *    the new state, with the section's errors updated.
 */
function removeSectionErrors(state: SubmissionObjectState, action: RemoveSectionErrorsAction): SubmissionObjectState {
  if (isNotEmpty(state[ action.payload.submissionId ])
    && isNotEmpty(state[ action.payload.submissionId ].sections[ action.payload.sectionId])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        sections: Object.assign({}, state[ action.payload.submissionId ].sections, {
          [ action.payload.sectionId ]: Object.assign({}, state[ action.payload.submissionId ].sections [ action.payload.sectionId ], {
            errors: []
          })
        })
      })
    });
  } else {
    return state;
  }
}

// ------ Submission functions ------ //

/**
 * Init a SubmissionObjectState.
 *
 * @param state
 *    the current state
 * @param action
 *    an InitSubmissionFormAction | ResetSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function initSubmission(state: SubmissionObjectState, action: InitSubmissionFormAction | ResetSubmissionFormAction): SubmissionObjectState {

  const newState = Object.assign({}, state);
  newState[ action.payload.submissionId ] = {
    collection: action.payload.collectionId,
    definition: action.payload.submissionDefinition.name,
    selfUrl: action.payload.selfUrl,
    activeSection: null,
    sections: Object.create(null),
    isLoading: true,
    savePending: false,
    saveDecisionPending: false,
    depositPending: false,
  };
  return newState;
}

/**
 * Reset submission.
 *
 * @param state
 *    the current state
 * @param action
 *    an ResetSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function resetSubmission(state: SubmissionObjectState, action: ResetSubmissionFormAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        sections: Object.create(null),
        isLoading: true
      })
    });
  } else {
    return state;
  }
}

/**
 * Set submission loading to false.
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
        isLoading: false
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
 *    an SaveSubmissionFormAction | SaveSubmissionSectionFormAction
 *    | SaveForLaterSubmissionFormAction | SaveAndDepositSubmissionAction
 * @return SubmissionObjectState
 *    the new state, with the flag set to true.
 */
function saveSubmission(state: SubmissionObjectState,
                        action: SaveSubmissionFormAction
                          | SaveSubmissionSectionFormAction
                          | SaveForLaterSubmissionFormAction
                          | SaveAndDepositSubmissionAction): SubmissionObjectState {
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
 *    an SaveSubmissionFormSuccessAction | SaveForLaterSubmissionFormSuccessAction
 *    | SaveSubmissionSectionFormSuccessAction | SaveSubmissionFormErrorAction
 *    | SaveForLaterSubmissionFormErrorAction | SaveSubmissionSectionFormErrorAction
 * @return SubmissionObjectState
 *    the new state, with the flag set to false.
 */
function completeSave(state: SubmissionObjectState,
                      action: SaveSubmissionFormSuccessAction
                        | SaveForLaterSubmissionFormSuccessAction
                        | SaveSubmissionSectionFormSuccessAction
                        | SaveSubmissionFormErrorAction
                        | SaveForLaterSubmissionFormErrorAction
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
 *    an InitSubmissionFormAction
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
 *    an InitSectionAction
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function initSection(state: SubmissionObjectState, action: InitSectionAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        sections: Object.assign({}, state[ action.payload.submissionId ].sections, {
          [ action.payload.sectionId ]: {
            header: action.payload.header,
            config: action.payload.config,
            mandatory: action.payload.mandatory,
            sectionType: action.payload.sectionType,
            visibility: action.payload.visibility,
            collapsed: false,
            enabled: action.payload.enabled,
            data: action.payload.data,
            errors: action.payload.errors || [],
            isLoading: false,
            isValid: false
          }
        })
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
        sections: Object.assign({}, state[ action.payload.submissionId ].sections, {
          [ action.payload.sectionId ]: Object.assign({}, state[ action.payload.submissionId ].sections [ action.payload.sectionId ], {
            enabled: true,
            data: action.payload.data,
            errors: action.payload.errors
          })
        })
      })
    });
  } else {
    return state;
  }
}

/**
 * Set a section state.
 *
 * @param state
 *    the current state
 * @param action
 *    an DisableSectionAction
 * @param enabled
 *    enabled or disabled section.
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function changeSectionState(state: SubmissionObjectState, action: EnableSectionAction | DisableSectionAction, enabled: boolean): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ].sections[ action.payload.sectionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        // sections: deleteProperty(state[ action.payload.submissionId ].sections, action.payload.sectionId),
        sections: Object.assign({}, state[ action.payload.submissionId ].sections, {
          [ action.payload.sectionId ]: Object.assign({}, state[ action.payload.submissionId ].sections [ action.payload.sectionId ], {
            enabled
          })
        })
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
 *    an SectionStatusChangeAction
 * @return SubmissionObjectState
 *    the new state, with the section new validity status.
 */
function setIsValid(state: SubmissionObjectState, action: SectionStatusChangeAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ].sections[ action.payload.sectionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        sections: Object.assign({}, state[ action.payload.submissionId ].sections,
          Object.assign({}, {
            [ action.payload.sectionId ]: Object.assign({}, state[ action.payload.submissionId ].sections [ action.payload.sectionId ], {
              isValid: action.payload.status
            })
          })
        )
      })
    });
  } else {
    return state;
  }
}

// ------ Upload file functions ------ //

/**
 * Set a new file.
 *
 * @param state
 *    the current state
 * @param action
 *    a NewUploadedFileAction action
 * @return SubmissionObjectState
 *    the new state, with the new file.
 */
function newFile(state: SubmissionObjectState, action: NewUploadedFileAction): SubmissionObjectState {
  const filesData = state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data as WorkspaceitemSectionUploadObject;
  let newData;
  if (isUndefined(filesData.files)) {
    newData = {
      files: [action.payload.data]
    };
  } else {
    newData = filesData;
    newData.files.push(action.payload.data)
  }

  return Object.assign({}, state, {
    [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
      sections: Object.assign({}, state[ action.payload.submissionId ].sections, {
        [ action.payload.sectionId ]: Object.assign({}, state[ action.payload.submissionId ].sections [ action.payload.sectionId ], {
          enabled: true,
          data: newData
        })
      })
    })
  });
}

/**
 * Edit a file.
 *
 * @param state
 *    the current state
 * @param action
 *    a EditFileDataAction action
 * @return SubmissionObjectState
 *    the new state, with the edited file.
 */
function editFileData(state: SubmissionObjectState, action: EditFileDataAction): SubmissionObjectState {
  const filesData = state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data as WorkspaceitemSectionUploadObject;
  if (hasValue(filesData.files)) {
    const fileIndex = findKey(
      filesData.files,
      { uuid: action.payload.fileId });
    if (isNotNull(fileIndex)) {
      const newData = Array.from(filesData.files);
      newData[fileIndex] = action.payload.data;
      return Object.assign({}, state, {
        [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
          activeSection: state[ action.payload.submissionId ].activeSection,
          sections: Object.assign({}, state[ action.payload.submissionId ].sections,
            Object.assign({}, {
              [ action.payload.sectionId ]: Object.assign({}, state[ action.payload.submissionId ].sections [ action.payload.sectionId ], {
                data: Object.assign({}, state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data, {
                  files: newData
                })
              })
            })
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
 * Delete a file.
 *
 * @param state
 *    the current state
 * @param action
 *    a DeleteUploadedFileAction action
 * @return SubmissionObjectState
 *    the new state, with the file removed.
 */
function deleteFile(state: SubmissionObjectState, action: DeleteUploadedFileAction): SubmissionObjectState {
  const filesData = state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data as WorkspaceitemSectionUploadObject;
  if (hasValue(filesData.files)) {
    const fileIndex: any = findKey(
      filesData.files,
      {uuid: action.payload.fileId});
    if (isNotNull(fileIndex)) {
      const newData = Array.from(filesData.files);
      newData.splice(fileIndex, 1);
      return Object.assign({}, state, {
        [ action.payload.submissionId ]: Object.assign({}, state[action.payload.submissionId], {
          sections: Object.assign({}, state[action.payload.submissionId].sections,
            Object.assign({}, {
              [ action.payload.sectionId ]: Object.assign({}, state[ action.payload.submissionId ].sections[ action.payload.sectionId ], {
                data: Object.assign({}, state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data, {
                  files: newData
                })
              })
            })
          )
        })
      });
    }
  }
  return state;
}

// ------ Detect duplicate functions ------ //

/**
 * Set decision flag to true
 *
 * @param state
 *    the current state
 * @param action
 *    an SetDuplicateDecisionAction
 * @return SubmissionObjectState
 *    the new state, with the decision flag changed.
 */
function startSaveDecision(state: SubmissionObjectState, action: SetDuplicateDecisionAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        saveDecisionPending: true,
      })
    });
  } else {
    return state;
  }
}

function setDuplicateMatches(state: SubmissionObjectState, action: SetDuplicateDecisionSuccessAction) {
  const index: any = findKey(
    action.payload.submissionObject,
    {id: parseInt(action.payload.submissionId, 10)});
  const sectionData = action.payload.submissionObject[index].sections[ action.payload.sectionId ] as WorkspaceitemSectionDetectDuplicateObject;
  const newData = (sectionData && sectionData.matches) ? sectionData : Object.create({});

  if (hasValue(state[ action.payload.submissionId ].sections[ action.payload.sectionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        sections: Object.assign({}, state[ action.payload.submissionId ].sections,
          Object.assign({}, {
            [ action.payload.sectionId ]: Object.assign({}, state[ action.payload.submissionId ].sections [ action.payload.sectionId ], {
              enabled: true,
              data: newData
            })
          })
        ),
        saveDecisionPending: false
      })
    });
  } else {
    return state;
  }
}

/**
 * Set decision flag to false
 *
 * @param state
 *    the current state
 * @param action
 *    an SetDuplicateDecisionSuccessAction or SetDuplicateDecisionErrorAction
 * @return SubmissionObjectState
 *    the new state, with the decision flag changed.
 */
function endSaveDecision(state: SubmissionObjectState, action: SetDuplicateDecisionSuccessAction | SetDuplicateDecisionErrorAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        saveDecisionPending: false,
      })
    });
  } else {
    return state;
  }
}
