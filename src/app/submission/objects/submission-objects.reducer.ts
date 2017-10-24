import { hasValue } from '../../shared/empty.util';

import {
  DeleteBitstreamAction,
  DisablePanelAction, EditBitstreamAction,
  EnablePanelAction, NewBitstreamAction,
  NewSubmissionFormAction, PanelStatusChangeAction,
  SubmissionObjectAction,
  SubmissionObjectActionTypes
} from './submission-objects.actions';

export interface SubmissionPanelObject {
  panelViewIndex: number;
  isValid: boolean;
}

export interface SubmissionPanelEntry {
  [panelId: string]: SubmissionPanelObject;
}

export interface SubmissionDataEntry {
  collection: Collection
}

export interface Collection {
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
  panels: SubmissionPanelEntry;
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

    // Panel actions

    case SubmissionObjectActionTypes.NEW: {
      return newSubmission(state, action as NewSubmissionFormAction);
    }

    case SubmissionObjectActionTypes.ENABLE_PANEL: {
      return enablePanel(state, action as EnablePanelAction);
    }

    case SubmissionObjectActionTypes.DISABLE_PANEL: {
      return disablePanel(state, action as DisablePanelAction);
    }

    case SubmissionObjectActionTypes.INIT_SUBMISSION_FORM: {
      return state;
    }

    case SubmissionObjectActionTypes.COMPLETE_INIT_SUBMISSION_FORM: {
      return state;
    }

    case SubmissionObjectActionTypes.PANEL_STATUS_CHANGE: {
      return setIsValid(state, action as PanelStatusChangeAction);
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

// ------ Panel functions ------ //

/**
 * Set a panel enabled.
 *
 * @param state
 *    the current state
 * @param action
 *    an EnablePanelAction
 * @return SubmissionObjectState
 *    the new state, with the panel removed.
 */
function enablePanel(state: SubmissionObjectState, action: EnablePanelAction): SubmissionObjectState {
  if (hasValue(state[action.payload.submissionId])) {
    return Object.assign({}, state, {
      [action.payload.submissionId]: Object.assign({}, state[action.payload.submissionId], {
        panels: Object.assign({}, state[action.payload.submissionId].panels, {
          [action.payload.panelId]: { panelViewIndex: action.payload.panelViewIndex, isValid: false }
        }),
        bitstreams:  Object.assign({}, state[action.payload.submissionId].bitstreams)
      })
    });
  } else {
    return state;
  }
}

/**
 * Set a panel disabled.
 *
 * @param state
 *    the current state
 * @param action
 *    an DisablePanelAction
 * @return SubmissionObjectState
 *    the new state, with the panel removed.
 */
function disablePanel(state: SubmissionObjectState, action: DisablePanelAction): SubmissionObjectState {
  if (hasValue(state[action.payload.submissionId].panels[action.payload.panelId])) {
    const newState = Object.assign({}, state);
    delete newState[action.payload.submissionId].panels[action.payload.panelId];
    return newState;
  } else {
    return state;
  }
}

/**
 * Set a panel enabled.
 *
 * @param state
 *    the current state
 * @param action
 *    an NewSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the panel removed.
 */
function newSubmission(state: SubmissionObjectState, action: NewSubmissionFormAction): SubmissionObjectState {
  if (!hasValue(state[action.payload.submissionId])) {
    const newState = Object.assign({}, state);
    // newState[action.payload.submissionId] = Object.create(null);
    newState[action.payload.submissionId] = {
      panels: Object.create(null),
      data: Object.create(null),
      bitstreams: Object.create(null)
    };
    return newState;
  } else {
    return state;
  }
}

/**
 * Set the panel validity.
 *
 * @param state
 *    the current state
 * @param action
 *    an NewSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the panel new validity status.
 */
function setIsValid(state: SubmissionObjectState, action: PanelStatusChangeAction): SubmissionObjectState {
  if (hasValue(state[action.payload.submissionId].panels[action.payload.panelId])) {
    return Object.assign({}, state, {
      [action.payload.submissionId]: Object.assign({}, state[action.payload.submissionId], {
        panels: Object.assign({},
                               state[action.payload.submissionId].panels,
                               Object.assign({},
                                              state[action.payload.submissionId].panels[action.payload.panelId],
                                              Object.assign({},
                                                {
                                                  panelViewIndex: state[action.payload.submissionId].panels[action.payload.panelId].panelViewIndex,
                                                  isValid: action.payload.status
                                                }
                                              )
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
      panels: state[action.payload.submissionId].panels,
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
        panels: state[action.payload.submissionId].panels,
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
      panels: state[action.payload.submissionId].panels,
      data: state[action.payload.submissionId].data,
      bitstreams: newBitstreams
    };
    return newState;
  } else {
    return state;
  }
}
