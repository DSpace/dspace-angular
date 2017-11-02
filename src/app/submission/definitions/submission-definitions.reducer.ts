import {
  NewPanelDefinitionAction,
  DefinitionsAction, SubmissionDefinitionActionTypes, NewDefinitionAction
} from './submission-definitions.actions';
import { hasValue, isUndefined } from '../../shared/empty.util';
import { SubmissionSectionModel } from '../../core/shared/config/config-submission-section.model';

export interface PanelObject {
  header: any;
  mandatory: boolean;
  sectionType: string;
  type: string;
  _links: {
    self: string;
    config: string;
    [name: string]: string;
  }
}

/**
 * The Panel Object Entry
 *
 * Consists of a map with Panel's ID as key,
 * and PanelObjects as values
 */
export interface PanelObjectEntry {
  [panelId: string]: SubmissionSectionModel;
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

    case SubmissionDefinitionActionTypes.INIT_DEFAULT_DEFINITION: {
      return state;
    }

    case SubmissionDefinitionActionTypes.COMPLETE_INIT_DEFAULT_DEFINITION: {
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
  if (hasValue(state[action.payload.definitionId])) {
    return Object.assign({}, state, {
      [action.payload.definitionId]: Object.assign({}, state[action.payload.definitionId], {
        panels: Object.assign({},
          state[action.payload.definitionId].panels,
          {
            [action.payload.panelId]: action.payload.panelObject
          }
        )
      })
    });
  } else {
    return state;
  }
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
  if (!hasValue(state[action.payload.definition.name])) {
    const newState = Object.assign({}, state);
    newState[action.payload.definition.name] = Object.assign({}, {
      panels: Object.create(null),
      isDefault: action.payload.definition.isDefault
    });
    return newState;
  } else {
    return state;
  }
}
