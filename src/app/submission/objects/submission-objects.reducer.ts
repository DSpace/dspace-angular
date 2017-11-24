import { hasValue, isNotUndefined } from '../../shared/empty.util';

import {
  CompleteInitSubmissionFormAction,
  DeleteBitstreamAction,
  DisableSectionAction, EditBitstreamAction,
  EnableSectionAction, NewBitstreamAction,
  NewSubmissionFormAction, SectionStatusChangeAction,
  SubmissionObjectAction,
  SubmissionObjectActionTypes
} from './submission-objects.actions';
import { deleteProperty } from '../../shared/object.util';
import { SubmissionUploadFileObject } from '../models/submission-upload-file.model';

export interface SubmissionSectionObject {
  sectionViewIndex: number;
  data: SubmissionDataEntry;
  isLoading: boolean;
  isValid: boolean;
}

export interface SubmissionSectionEntry {
  [sectionId: string]: SubmissionSectionObject;
}

export interface SubmissionDataEntry {
  files: SubmissionUploadFileEntry;
}

export interface SubmissionCollectionObject {
  id: string;
  name: string;
  policiesMessageType: number;
  policies: SubmissionPoliciesObject;
}

export interface SubmissionUploadFileEntry {
  [uuid: string]: SubmissionUploadFileObject
}

export interface SubmissionBitstreamObject {
  name: string;
  title: string;
  description: string;
  size: number;
  hash: string;
  thumbnail: string;
  policies: SubmissionPoliciesObject;
}

export interface SubmissionPoliciesObject {
  [index: number]: {
    type: string;
    name: string;
    date: string;
    availableGroups: SubmissionPoliciesGroupObject;
  }
}

export interface SubmissionPoliciesGroupObject {
  [index: number]: {
    id: string;
    name: string;
    selected: boolean;
  }
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

    case SubmissionObjectActionTypes.NEW: {
      return newSubmission(state, action as NewSubmissionFormAction);
    }

    case SubmissionObjectActionTypes.ENABLE_SECTION: {
      return enableSection(state, action as EnableSectionAction);
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

    case SubmissionObjectActionTypes.NEW_BITSTREAM: {
      return newFile(state, action as NewBitstreamAction);
    }

    case SubmissionObjectActionTypes.EDIT_BITSTREAM: {
      return editFileData(state, action as EditBitstreamAction);
    }

    case SubmissionObjectActionTypes.DELETE_BITSTREAM: {
      return deleteFile(state, action as DeleteBitstreamAction);
    }

    default: {
      return state;
    }
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
function completeInit(state: SubmissionObjectState, action: CompleteInitSubmissionFormAction): SubmissionObjectState {
  if (hasValue(state[action.payload.submissionId])) {
    return Object.assign({}, state, {
      [action.payload.submissionId]: Object.assign({}, state[action.payload.submissionId], {
        sections: state[action.payload.submissionId].sections,
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
  if (hasValue(state[action.payload.submissionId])) {
    return Object.assign({}, state, {
      [action.payload.submissionId]: Object.assign({}, state[action.payload.submissionId], {
        sections: Object.assign({}, state[action.payload.submissionId].sections, {
          [action.payload.sectionId]: {
            sectionViewIndex: action.payload.sectionViewIndex,
            data: Object.create(null),
            isValid: false
          }
        }),
        isLoading: state[action.payload.submissionId].isLoading,
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
  if (hasValue(state[action.payload.submissionId].sections[action.payload.sectionId])) {
    return Object.assign({}, state, {
      [action.payload.submissionId]: Object.assign({}, state[action.payload.submissionId], {
        sections: deleteProperty(state[action.payload.submissionId].sections, action.payload.sectionId),
        isLoading: state[action.payload.submissionId].isLoading,
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
 *    an NewSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function newSubmission(state: SubmissionObjectState, action: NewSubmissionFormAction): SubmissionObjectState {
  if (!hasValue(state[action.payload.submissionId])) {
    const newState = Object.assign({}, state);
    // newState[action.payload.submissionId] = Object.create(null);
    newState[action.payload.submissionId] = {
      sections: Object.create(null),
      isLoading: true
    };
    return newState;
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
 *    an NewSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the section new validity status.
 */
function setIsValid(state: SubmissionObjectState, action: SectionStatusChangeAction): SubmissionObjectState {
  if (hasValue(state[action.payload.submissionId].sections[action.payload.sectionId])) {
    return Object.assign({}, state, {
      [action.payload.submissionId]: Object.assign({}, state[action.payload.submissionId], {
        sections: Object.assign({}, state[action.payload.submissionId].sections,
          Object.assign({}, {
            [action.payload.sectionId]: {
              sectionViewIndex: state[action.payload.submissionId].sections[action.payload.sectionId].sectionViewIndex,
              data: state[action.payload.submissionId].sections[action.payload.sectionId].data,
              isValid: action.payload.status,
            }
          })
        ),
        isLoading: state[action.payload.submissionId].isLoading,
      })
    });
  } else {
    return state;
  }
}

// ------ Bitstream functions ------ //

/**
 * Set a new bitstream.
 *
 * @param state
 *    the current state
 * @param action
 *    a NewBitstreamAction action
 * @return SubmissionObjectState
 *    the new state, with the new bitstream.
 */
function newFile(state: SubmissionObjectState, action: NewBitstreamAction): SubmissionObjectState {
  if (isNotUndefined(state[action.payload.submissionId].sections[action.payload.sectionId].data.files)
    && !hasValue(state[action.payload.submissionId].sections[action.payload.sectionId].data.files[action.payload.bitstreamId])) {
    const newState = Object.assign({}, state);
    const newData  = [];
    newData[action.payload.bitstreamId] = action.payload.data;
    return Object.assign({}, state, {
      [action.payload.submissionId]: Object.assign({}, state[action.payload.submissionId], {
        sections: Object.assign({}, state[action.payload.submissionId].sections,
          Object.assign({}, {
              [action.payload.sectionId]: {
                sectionViewIndex: state[action.payload.submissionId].sections[action.payload.sectionId].sectionViewIndex,
                data: Object.assign({}, state[action.payload.submissionId].sections[action.payload.sectionId].data, {
                  files: Object.assign({},
                    state[action.payload.submissionId].sections[action.payload.sectionId].data.files,
                    newData)
                }),
                isValid: state[action.payload.submissionId].sections[action.payload.sectionId].isValid
              }
            }
          )
        ),
        isLoading: state[action.payload.submissionId].isLoading,
      })
    });
  } else {
    const newState = Object.assign({}, state);
    const newData  = [];
    newData[action.payload.bitstreamId] = action.payload.data;
    return Object.assign({}, state, {
      [action.payload.submissionId]: Object.assign({}, state[action.payload.submissionId], {
        sections: Object.assign({}, state[action.payload.submissionId].sections,
          Object.assign({}, {
            [action.payload.sectionId]: {
              sectionViewIndex: state[action.payload.submissionId].sections[action.payload.sectionId].sectionViewIndex,
              data: Object.assign({}, state[action.payload.submissionId].sections[action.payload.sectionId].data, {
                files: newData
              }),
              isValid: state[action.payload.submissionId].sections[action.payload.sectionId].isValid
            }
          })
        ),
        isLoading: state[action.payload.submissionId].isLoading,
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
 *    a EditBitstreamAction action
 * @return SubmissionObjectState
 *    the new state, with the edited bitstream.
 */
function editFileData(state: SubmissionObjectState, action: EditBitstreamAction): SubmissionObjectState {
  if (hasValue(state[action.payload.submissionId].sections[action.payload.sectionId].data.files[action.payload.bitstreamId])) {
    return Object.assign({}, state, {
      [action.payload.submissionId]: Object.assign({}, state[action.payload.submissionId], {
        sections: Object.assign({}, state[action.payload.submissionId].sections,
          Object.assign({}, {
              [action.payload.sectionId]: {
                sectionViewIndex: state[action.payload.submissionId].sections[action.payload.sectionId].sectionViewIndex,
                data: Object.assign({}, state[action.payload.submissionId].sections[action.payload.sectionId].data, {
                  files: Object.assign({},
                    state[action.payload.submissionId].sections[action.payload.sectionId].data.files, {
                      [action.payload.bitstreamId]: action.payload.data
                    })
                }),
                isValid: state[action.payload.submissionId].sections[action.payload.sectionId].isValid
              }
            }
          )
        ),
        isLoading: state[action.payload.submissionId].isLoading,
      })
    });
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
 *    a DeleteBitstreamAction action
 * @return SubmissionObjectState
 *    the new state, with the bitstream removed.
 */
function deleteFile(state: SubmissionObjectState, action: DeleteBitstreamAction): SubmissionObjectState {
  if (hasValue(state[action.payload.submissionId].sections[action.payload.sectionId].data.files[action.payload.bitstreamId])) {
    const newState = Object.assign({}, state);
    return Object.assign({}, state, {
      [action.payload.submissionId]: Object.assign({}, state[action.payload.submissionId], {
        sections: Object.assign({}, state[action.payload.submissionId].sections,
          Object.assign({}, {
              [action.payload.sectionId]: {
                sectionViewIndex: state[action.payload.submissionId].sections[action.payload.sectionId].sectionViewIndex,
                isValid: state[action.payload.submissionId].sections[action.payload.sectionId].isValid,
                data: Object.assign({}, state[action.payload.submissionId].sections[action.payload.sectionId].data, {
                  files: deleteProperty(state[action.payload.submissionId].sections[action.payload.sectionId].data.files, action.payload.bitstreamId)
                })
              }
            }
          )
        ),
        isLoading: state[action.payload.submissionId].isLoading,
      })
    });
  } else {
    return state;
  }
}
