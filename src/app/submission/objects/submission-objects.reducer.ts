import { hasValue } from '../../shared/empty.util';

import {
  DeleteBitstreamAction,
  DisableSectionAction, EditBitstreamAction,
  EnableSectionAction, NewBitstreamAction,
  NewSubmissionFormAction, SectionStatusChangeAction,
  SubmissionObjectAction,
  SubmissionObjectActionTypes
} from './submission-objects.actions';
import { deleteProperty } from '../../shared/object.util';

export interface SubmissionSectionObject {
  sectionViewIndex: number;
  isValid: boolean;
}

export interface SubmissionSectionEntry {
  [sectionId: string]: SubmissionSectionObject;
}

export interface SubmissionDataEntry {
  collection: SubmissionCollectionObject
}

export interface SubmissionCollectionObject {
  id: string;
  name: string;
  policiesMessageType: number;
  policies: SubmissionPoliciesObject;
}

export interface SubmissionBitstreamEntry {
  [uuid: string]: SubmissionBitstreamObject
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
  data: SubmissionDataEntry;
  bitstreams: SubmissionBitstreamEntry;
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
      return state;
    }

    case SubmissionObjectActionTypes.SECTION_STATUS_CHANGE: {
      return setIsValid(state, action as SectionStatusChangeAction);
    }
    // Bitstram actions

    case SubmissionObjectActionTypes.NEW_BITSTREAM: {
      return newBitstream(state, action as NewBitstreamAction);
    }

    case SubmissionObjectActionTypes.EDIT_BITSTREAM: {
      return editBitstream(state, action as EditBitstreamAction);
    }

    case SubmissionObjectActionTypes.DELETE_BITSTREAM: {
      return deleteBitstream(state, action as DeleteBitstreamAction);
    }

    default: {
      return state;
    }
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
          [action.payload.sectionId]: { sectionViewIndex: action.payload.sectionViewIndex, isValid: false }
        }),
        bitstreams:  Object.assign({}, state[action.payload.submissionId].bitstreams)
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
        data: Object.assign({}, state[action.payload.submissionId].data),
        bitstreams:  Object.assign({}, state[action.payload.submissionId].bitstreams)
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
      data: Object.create(null),
      bitstreams: Object.create(null)
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
        sections: Object.assign({},
                               state[action.payload.submissionId].sections,
                               Object.assign({},
                                             {
                                               [action.payload.sectionId]: {
                                                                           sectionViewIndex: state[action.payload.submissionId].sections[action.payload.sectionId].sectionViewIndex,
                                                                           isValid: action.payload.status
                                                                         }
                                             }
                               )
        ),
        data: state[action.payload.submissionId].data,
        bitstreams: state[action.payload.submissionId].data
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
function newBitstream(state: SubmissionObjectState, action: NewBitstreamAction): SubmissionObjectState {
  if (!hasValue(state[action.payload.submissionId].bitstreams[action.payload.bitstreamId])) {
    const newState = Object.assign({}, state);
    const newData  = [];
    newData[action.payload.bitstreamId] = action.payload.data;
    newState[action.payload.submissionId] = {
      sections: state[action.payload.submissionId].sections,
      data: state[action.payload.submissionId].data,
      bitstreams: Object.assign(
        {},
        state[action.payload.submissionId].bitstreams,
        newData
      )
    };
    return newState;
  } else {
    return state;
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
function editBitstream(state: SubmissionObjectState, action: EditBitstreamAction): SubmissionObjectState {
  if (hasValue(state[action.payload.submissionId].bitstreams[action.payload.bitstreamId])) {
    return Object.assign({}, state, {
      [action.payload.submissionId]: Object.assign({}, state[action.payload.submissionId], {
        sections: state[action.payload.submissionId].sections,
        data: state[action.payload.submissionId].data,
        bitstreams: Object.assign({},
                                  state[action.payload.submissionId].bitstreams,
                                  {
                                            [action.payload.bitstreamId]: action.payload.data
                                          }
        ),
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
function deleteBitstream(state: SubmissionObjectState, action: DeleteBitstreamAction): SubmissionObjectState {
  if (hasValue(state[action.payload.submissionId].bitstreams[action.payload.bitstreamId])) {
    const newState = Object.assign({}, state);
    const newBitstreams  = {};
    for (const key in newState[action.payload.submissionId].bitstreams) {
      if (key !== action.payload.bitstreamId) {
        newBitstreams[key] = newState[action.payload.submissionId].bitstreams[key];
      }
    }
    newState[action.payload.submissionId] = {
      sections: state[action.payload.submissionId].sections,
      data: state[action.payload.submissionId].data,
      bitstreams: newBitstreams
    };
    return newState;
  } else {
    return state;
  }
}
