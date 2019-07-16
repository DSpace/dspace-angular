import { ListableObject } from '../../object-collection/shared/listable-object.model';
import {
  SelectableListAction,
  SelectableListActionTypes,
  SelectableListSelectAction,
  SelectableListSelectSingleAction,
  SelectableListDeselectAction,
  SelectableListDeselectSingleAction, SelectableListSetSelectionAction
} from './selectable-list.actions';
import { hasNoValue } from '../../empty.util';

/**
 * Represents the state of all selectable lists in the store
 */
export type SelectableListsState = {
  [id: string]: SelectableListState;
}

/**
 * Represents the state of a single selectable list in the store
 */
export interface SelectableListState {
  id: string;
  selection: ListableObject[];
}

/**
 * Reducer that handles SelectableListAction to update the SelectableListsState
 * @param {SelectableListsState} state The initial SelectableListsState
 * @param {SelectableListAction} action The Action to be performed on the state
 * @returns {SelectableListsState} The new, reducer SelectableListsState
 */
export function selectableListReducer(state: SelectableListsState = {}, action: SelectableListAction): SelectableListsState {
  const listState: SelectableListState = state[action.id] || clearSelection(action.id);
  switch (action.type) {
    case SelectableListActionTypes.SELECT: {
      const newListState = select(listState, action as SelectableListSelectAction);
      return Object.assign({}, state, { [action.id]: newListState });
    }
    case SelectableListActionTypes.SELECT_SINGLE: {
      const newListState = selectSingle(listState, action as SelectableListSelectSingleAction);
      return Object.assign({}, state, { [action.id]: newListState });
    }
    case SelectableListActionTypes.DESELECT: {
      const newListState = deselect(listState, action as SelectableListDeselectAction);
      return Object.assign({}, state, { [action.id]: newListState });
    }
    case SelectableListActionTypes.DESELECT_SINGLE: {
      const newListState = deselectSingle(listState, action as SelectableListDeselectSingleAction);
      return Object.assign({}, state, { [action.id]: newListState });
    }
    case SelectableListActionTypes.SET_SELECTION: {
      const newListState = setList(listState, action as SelectableListSetSelectionAction);
      return Object.assign({}, state, { [action.id]: newListState });
    }
    case SelectableListActionTypes.DESELECT_ALL: {
      const newListState = clearSelection(action.id);
      return Object.assign({}, state, { [action.id]: newListState });
    }
    default: {
      return state;
    }
  }
}

function select(state: SelectableListState, action: SelectableListSelectAction) {
  const filteredNewObjects = action.payload.filter((object) => !isObjectInSelection(state.selection, object));
  const newSelection = [...state.selection, ...filteredNewObjects];
  return Object.assign({}, state, { selection: newSelection });
}

function selectSingle(state: SelectableListState, action: SelectableListSelectSingleAction) {
  let newSelection;
  if (action.payload.multipleSelectionsAllowed && !isObjectInSelection(state.selection, action.payload.object)) {
    newSelection = [...state.selection, action.payload.object];
  } else {
    newSelection = [action.payload.object];
  }
  return Object.assign({}, state, { selection: newSelection });
}

function deselect(state: SelectableListState, action: SelectableListDeselectAction) {
  const newSelection = state.selection.filter((selected) => hasNoValue(action.payload.find((object) => object.uuid === selected.uuid)));
  return Object.assign({}, state, { selection: newSelection });
}

function deselectSingle(state: SelectableListState, action: SelectableListDeselectSingleAction) {
  const newSelection = state.selection.filter((selected) => {
    return selected.uuid !== action.payload.uuid
  });
  return Object.assign({}, state, { selection: newSelection });
}

function setList(state: SelectableListState, action: SelectableListSetSelectionAction) {
  return Object.assign({}, state, { selection: action.payload });
}

function clearSelection(id: string) {
  return { id: id, selection: [] };
}


function isObjectInSelection(selection: ListableObject[], object: ListableObject) {
  return selection.findIndex((selected) => selected.uuid === object.uuid) >= 0
}
