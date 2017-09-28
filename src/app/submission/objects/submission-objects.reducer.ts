import { hasValue } from '../../shared/empty.util';

import {
  DisablePanelAction,
  EnablePanelAction,
  NewSubmissionFormAction,
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
  data: object;
}

export interface SubmissionObjectEntry {
  panels: SubmissionPanelEntry;
  data: SubmissionDataEntry;
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

    default: {
      return state;
    }
  }
}

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
    const newState = Object.assign({}, state);
    newState[action.payload.submissionId].panels = Object.assign({}, newState[action.payload.submissionId].panels, {
      [action.payload.panelId]: { panelViewIndex: action.payload.panelViewIndex}
    });
    return newState;
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
    newState[action.payload.submissionId] = Object.create(null);
    return newState;
  } else {
    return state;
  }
}
