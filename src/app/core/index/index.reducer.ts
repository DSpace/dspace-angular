import {
  IndexAction,
  IndexActionTypes,
  AddToIndexAction,
  RemoveFromIndexByValueAction, RemoveFromIndexBySubstringAction
} from './index.actions';

export enum IndexName {
  OBJECT = 'object/uuid-to-self-link',
  REQUEST = 'get-request/href-to-uuid',
  UUID_MAPPING = 'get-request/configured-to-cache-uuid'
}

export type IndexState = {
  [name in IndexName]: {
    [key: string]: string
  }
}

// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
const initialState: IndexState = Object.create(null);

export function indexReducer(state = initialState, action: IndexAction): IndexState {
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

function addToIndex(state: IndexState, action: AddToIndexAction): IndexState {
  const subState = state[action.payload.name];
  const newSubState = Object.assign({}, subState, {
    [action.payload.key]: action.payload.value
  });
  const obs = Object.assign({}, state, {
    [action.payload.name]: newSubState
  });
  return obs;
}

function removeFromIndexByValue(state: IndexState, action: RemoveFromIndexByValueAction): IndexState {
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

function removeFromIndexBySubstring(state: IndexState, action: RemoveFromIndexByValueAction): IndexState {
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
