import {
  NewSectionDefinitionAction,
  DefinitionsAction, SubmissionDefinitionActionTypes, NewDefinitionAction
} from './submission-definitions.actions';
import { hasValue } from '../../shared/empty.util';
import { SubmissionSectionModel } from '../../core/shared/config/config-submission-section.model';

/**
 * The Section Object Entry
 *
 * Consists of a map with Section's ID as key,
 * and SubmissionSectionModel as values
 */
export interface SectionObjectEntry {
  [sectionId: string]: SubmissionSectionModel;
}

/**
 * The Definition Entry
 */
export interface SubmissionDefinitionEntry {
  sections: SectionObjectEntry;
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

    case SubmissionDefinitionActionTypes.NEW_SECTION_DEFINITION: {
      return newSectionDefinition(state, action as NewSectionDefinitionAction);
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

    case SubmissionDefinitionActionTypes.REMOVE_DEFINITIONS: {
      return initialState;
    }

    default: {
      return state;
    }
  }
}

/**
 * Add a section to section list.
 *
 * @param state
 *    the current state
 * @param action
 *    an BoxAddAction
 * @return SubmissionDefinitionState
 *    the new state, with the section added.
 */
function newSectionDefinition(state: SubmissionDefinitionState, action: NewSectionDefinitionAction): SubmissionDefinitionState {
  if (hasValue(state[action.payload.definitionId])) {
    return Object.assign({}, state, {
      [action.payload.definitionId]: Object.assign({}, state[action.payload.definitionId], {
        sections: Object.assign({},
          state[action.payload.definitionId].sections,
          {
            [action.payload.sectionId]: action.payload.sectionObject
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
 *    the new state, with the section added.
 */
function newDefinition(state: SubmissionDefinitionState, action: NewDefinitionAction): SubmissionDefinitionState {
  if (!hasValue(state[action.payload.definition.name])) {
    const newState = Object.assign({}, state);
    newState[action.payload.definition.name] = Object.assign({}, {
      sections: Object.create(null),
      isDefault: action.payload.definition.isDefault
    });
    return newState;
  } else {
    return state;
  }
}
