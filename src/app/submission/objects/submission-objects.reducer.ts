import { hasValue, isNotNull, isNotUndefined } from '../../shared/empty.util';
import { findKey, uniqWith, isEqual, differenceWith } from 'lodash';

import {
  CompleteInitSubmissionFormAction,
  DeleteUploadedFileAction,
  DisableSectionAction, EditFileDataAction,
  EnableSectionAction, NewUploadedFileAction,
  LoadSubmissionFormAction, SectionStatusChangeAction,
  SubmissionObjectAction,
  SubmissionObjectActionTypes, ClearSectionErrorsAction, InertSectionErrorsAction,
  DeleteSectionErrorsAction, ResetSubmissionFormAction, UpdateSectionDataAction
} from './submission-objects.actions';
import { deleteProperty } from '../../shared/object.util';
import { WorkspaceitemSectionUploadFileObject } from '../models/workspaceitem-section-upload-file.model';

export interface SubmissionSectionObject {
  sectionViewIndex: number;
  data: SubmissionDataEntry;
  errors: SubmissionError[];
  isLoading: boolean;
  isValid: boolean;
}

export interface SubmissionError {
  path: string;
  message: string;
}

export interface SubmissionSectionEntry {
  [sectionId: string]: SubmissionSectionObject;
}

export interface SubmissionDataEntry {
  files: SubmissionUploadFileEntry;
}

export interface SubmissionUploadFileEntry {
  [uuid: string]: WorkspaceitemSectionUploadFileObject
}

export interface SubmissionObjectEntry {
  sections: SubmissionSectionEntry;
  isLoading: boolean;
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

const initialState: SubmissionObjectState = Object.create(null);

export function submissionObjectReducer(state = initialState, action: SubmissionObjectAction): SubmissionObjectState {
  switch (action.type) {

    // Section actions

    case SubmissionObjectActionTypes.LOAD_SUBMISSION_FORM: {
      return initSubmission(state, action as LoadSubmissionFormAction);
    }

    case SubmissionObjectActionTypes.RESET_SUBMISSION_FORM: {
      return state;
    }

    case SubmissionObjectActionTypes.ENABLE_SECTION: {
      return enableSection(state, action as EnableSectionAction);
    }

    case SubmissionObjectActionTypes.UPLOAD_SECTION_DATA: {
      return updateSectionData(state, action as UpdateSectionDataAction);
    }

    case SubmissionObjectActionTypes.DISABLE_SECTION: {
      return disableSection(state, action as DisableSectionAction);
    }

    case SubmissionObjectActionTypes.INIT_SUBMISSION_FORM: {
      return state;
    }

    case SubmissionObjectActionTypes.COMPLETE_INIT_SUBMISSION_FORM: {
      return completeInit(state, action as CompleteInitSubmissionFormAction);
    }

    case SubmissionObjectActionTypes.SECTION_STATUS_CHANGE: {
      return setIsValid(state, action as SectionStatusChangeAction);
    }

    // Bitstram actions
    case SubmissionObjectActionTypes.NEW_FILE: {
      return newFile(state, action as NewUploadedFileAction);
    }

    case SubmissionObjectActionTypes.EDIT_FILE_DATA: {
      return editFileData(state, action as EditFileDataAction);
    }

    case SubmissionObjectActionTypes.DELETE_FILE: {
      return deleteFile(state, action as DeleteUploadedFileAction);
    }

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
        sections: Object.assign({}, state[ submissionId ].sections, {
          [ sectionId ]: {
            sectionViewIndex: state[ submissionId ].sections[ sectionId ].sectionViewIndex,
            data: state[ submissionId ].sections[ sectionId ].data,
            isValid: state[ submissionId ].sections[ sectionId ].isValid,
            errors,
          }
        }),
        isLoading: state[ action.payload.submissionId ].isLoading,
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
        sections: Object.assign({}, state[ submissionId ].sections, {
          [ sectionId ]: {
            sectionViewIndex: state[ submissionId ].sections[ sectionId ].sectionViewIndex,
            data: state[ submissionId ].sections[ sectionId ].data,
            isValid: state[ submissionId ].sections[ sectionId ].isValid,
            errors,
          }
        }),
        isLoading: state[ action.payload.submissionId ].isLoading,
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
        sections: Object.assign({}, state[ submissionId ].sections, {
          [ sectionId ]: {
            sectionViewIndex: state[ submissionId ].sections[ sectionId ].sectionViewIndex,
            data: state[ submissionId ].sections[ sectionId ].data,
            isValid: state[ submissionId ].sections[ sectionId ].isValid,
            errors,
          }
        }),
        isLoading: state[ action.payload.submissionId ].isLoading,
      })
    });
  } else {
    return state;
  }
};

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
function completeInit(state: SubmissionObjectState, action: CompleteInitSubmissionFormAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        sections: state[ action.payload.submissionId ].sections,
        isLoading: false,
      })
    });
  } else {
    return state;
  }
}

// ------ Section functions ------ //

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
        sections: Object.assign({}, state[ action.payload.submissionId ].sections, {
          [ action.payload.sectionId ]: {
            sectionViewIndex: action.payload.sectionViewIndex,
            data: action.payload.data,
            isValid: false,
            errors: []
          }
        }),
        isLoading: state[ action.payload.submissionId ].isLoading,
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
  if (hasValue(state[ action.payload.submissionId ]
      && hasValue(state[ action.payload.submissionId ].sections[ action.payload.sectionId]))) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        sections: Object.assign({}, state[ action.payload.submissionId ].sections, {
          [ action.payload.sectionId ]: {
            sectionViewIndex: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].sectionViewIndex,
            data: action.payload.data,
            isValid: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].isValid,
            errors: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].errors
          }
        }),
        isLoading: state[ action.payload.submissionId ].isLoading,
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
        sections: deleteProperty(state[ action.payload.submissionId ].sections, action.payload.sectionId),
        isLoading: state[ action.payload.submissionId ].isLoading,
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
function initSubmission(state: SubmissionObjectState, action: LoadSubmissionFormAction | ResetSubmissionFormAction): SubmissionObjectState {
  const newState = Object.assign({}, state);
  newState[ action.payload.submissionId ] = {
    sections: Object.create(null),
    isLoading: true
  };
  return newState;
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
  if (isNotUndefined(state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data.files)
    && !hasValue(state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data.files[ action.payload.fileId ])) {
    const newData = [];
    newData[ action.payload.fileId ] = action.payload.data;
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        sections: Object.assign({}, state[ action.payload.submissionId ].sections,
          Object.assign({}, {
              [ action.payload.sectionId ]: {
                sectionViewIndex: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].sectionViewIndex,
                data: Object.assign({}, state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data, {
                  files: Object.assign({},
                    state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data.files,
                    newData)
                }),
                isValid: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].isValid,
                errors: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].errors
              }
            }
          )
        ),
        isLoading: state[ action.payload.submissionId ].isLoading,
      })
    });
  } else {
    const newData = [];
    newData[ action.payload.fileId ] = action.payload.data;
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
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
  if (hasValue(state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data.files)) {
    const fileIndex = findKey(
      state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data.files,
      { uuid: action.payload.fileId });
    if (isNotNull(fileIndex)) {
      return Object.assign({}, state, {
        [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
          sections: Object.assign({}, state[ action.payload.submissionId ].sections,
            Object.assign({}, {
                [ action.payload.sectionId ]: {
                  sectionViewIndex: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].sectionViewIndex,
                  data: Object.assign({}, state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data, {
                    files: Object.assign({},
                      state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data.files, {
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
        })
      });
    } else {
      return state;
    }
  } else {
    return state;
  }
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
  if (hasValue(state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data.files[ action.payload.fileId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        sections: Object.assign({}, state[ action.payload.submissionId ].sections,
          Object.assign({}, {
              [ action.payload.sectionId ]: {
                sectionViewIndex: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].sectionViewIndex,
                data: Object.assign({}, state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data, {
                  files: deleteProperty(state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data.files, action.payload.fileId)
                }),
                isValid: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].isValid,
                errors: state[ action.payload.submissionId ].sections[ action.payload.sectionId ].errors
              }
            }
          )
        ),
        isLoading: state[ action.payload.submissionId ].isLoading,
      })
    });
  } else {
    return state;
  }
}
