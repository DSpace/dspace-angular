import {
  AddToIndexAction,
  IndexAction,
  IndexActionTypes,
  RemoveFromIndexBySubstringAction,
  RemoveFromIndexByValueAction
} from './index.actions';

export enum IndexName {
  OBJECT = 'object/uuid-to-self-link',
  REQUEST = 'get-request/href-to-uuid',
  UUID_MAPPING = 'get-request/configured-to-cache-uuid'
}

export interface IndexState {
  [key: string]: string
}

export type MetaIndexState = {
  [name in IndexName]: IndexState
}

// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
const initialState: MetaIndexState = Object.create(null);

export function indexReducer(state = initialState, action: IndexAction): MetaIndexState {
  switch (action.type) {

    case IndexActionTypes.ADD: {
      return addToIndex(state, action as AddToIndexAction);
    }

    case IndexActionTypes.REMOVE_BY_VALUE: {
      return removeFromIndexByValue(state, action as RemoveFromIndexByValueAction)
    }

    case IndexActionTypes.REMOVE_BY_SUBSTRING: {
      return removeFromIndexBySubstring(state, action as RemoveFromIndexBySubstringAction)
    }

    default: {
      return state;
    }
  }
}

function addToIndex(state: MetaIndexState, action: AddToIndexAction): MetaIndexState {
  const subState = state[action.payload.name];
  const newSubState = Object.assign({}, subState, {
    [action.payload.key]: action.payload.value
  });
  const obs = Object.assign({}, state, {
    [action.payload.name]: newSubState
  });
  return obs;
}

function removeFromIndexByValue(state: MetaIndexState, action: RemoveFromIndexByValueAction): MetaIndexState {
  const subState = state[action.payload.name];
  const newSubState = Object.create(null);
  for (const value in subState) {
    if (subState[value] !== action.payload.value) {
      newSubState[value] = subState[value];
    }
  }
  return Object.assign({}, state, {
    [action.payload.name]: newSubState
  });
}

/**
 * Remove values from the IndexState's substate that contain a given substring
 * @param state     The IndexState to remove values from
 * @param action    The RemoveFromIndexByValueAction containing the necessary information to remove the values
 */
function removeFromIndexBySubstring(state: MetaIndexState, action: RemoveFromIndexByValueAction): MetaIndexState {
  const subState = state[action.payload.name];
  const newSubState = Object.create(null);
  for (const value in subState) {
    if (value.indexOf(action.payload.value) < 0) {
      newSubState[value] = subState[value];
    }
  }
  return Object.assign({}, state, {
    [action.payload.name]: newSubState
  });
}
