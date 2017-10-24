import {
  NewPanelDefinitionAction,
  DefinitionsAction, SubmissionDefinitionActionTypes, NewDefinitionAction
} from './submission-definitions.actions';
import { hasValue, isUndefined } from '../../shared/empty.util';

export interface PanelObject {
  id: string,
  header: any;
  mandatory: boolean;
  checkable: boolean;
  scope: any;
  sectionType: string;
}

/**
 * The Panel Object Entry
 *
 * Consists of a map with Panel's ID as key,
 * and PanelObjects as values
 */
export interface PanelObjectEntry {
  [panelId: string]: PanelObject;
}

/**
 * The Definition Entry
 */
export interface SubmissionDefinitionEntry {
  panels: PanelObjectEntry;
  isDefault: boolean;
}

/**
 * The Definition State
 *
 * Consists of a map with definition's ID as key,
 * and SubmissionDefinitionEntries as values
 */
export interface SubmissionDefinitionState {
  [definitionId: string]: SubmissionDefinitionEntry;
}

const initialState: SubmissionDefinitionState = Object.create(null);

export function submissionDefinitionReducer(state = initialState, action: DefinitionsAction): SubmissionDefinitionState {
  switch (action.type) {

    case SubmissionDefinitionActionTypes.NEW_PANEL_DEFINITION: {
      return newPanelDefinition(state, action as NewPanelDefinitionAction);
    }

    case SubmissionDefinitionActionTypes.NEW_DEFINITION: {
      return newDefinition(state, action as NewDefinitionAction);
    }

    case SubmissionDefinitionActionTypes.INIT_DEFINITIONS: {
      return state;
    }

    case SubmissionDefinitionActionTypes.COMPLETE_INIT_DEFINITIONS: {
      return state;
    }

    case SubmissionDefinitionActionTypes.RETRIEVE_DEFINITIONS: {
      return state;
    }

    default: {
      return state;
    }
  }
}

/**
 * Add a panel to panel list.
 *
 * @param state
 *    the current state
 * @param action
 *    an BoxAddAction
 * @return SubmissionDefinitionState
 *    the new state, with the panel added.
 */
function newPanelDefinition(state: SubmissionDefinitionState, action: NewPanelDefinitionAction): SubmissionDefinitionState {
  return Object.assign({}, state, {
    [action.payload.definitionId]: Object.assign({}, state[action.payload.definitionId], {
      panels: Object.assign({}, state[action.payload.definitionId].panels, {
        [action.payload.panelId]: {
          header: action.payload.panelObject.header,
          mandatory: action.payload.panelObject.mandatory,
          scope: action.payload.panelObject.scope,
          sectionType: action.payload.panelObject.sectionType,
          checkable: action.payload.panelObject.checkable,
          // config: action.payload.panelObject._links.config.href
        }
      })
    })
  });
}

/**
 * Add a submission definition to state.
 *
 * @param state
 *    the current state
 * @param action
 *    an BoxAddAction
 * @return SubmissionDefinitionState
 *    the new state, with the panel added.
 */
function newDefinition(state: SubmissionDefinitionState, action: NewDefinitionAction): SubmissionDefinitionState {
  if (!hasValue(state[action.payload.definitionId])) {
    const newState = Object.assign({}, state);
    newState[action.payload.definitionId] = Object.assign({}, {
      panels: Object.create(null),
      isDefault: action.payload.isDefault
    });
    return newState;
  } else {
    return state;
  }
}
