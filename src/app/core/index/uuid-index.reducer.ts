import {
  UUIDIndexAction,
  UUIDIndexActionTypes,
  AddToUUIDIndexAction,
  RemoveHrefFromUUIDIndexAction
} from './uuid-index.actions';

export interface UUIDIndexState {
  [uuid: string]: string
}

// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
const initialState: UUIDIndexState = Object.create(null);

export function uuidIndexReducer(state = initialState, action: UUIDIndexAction): UUIDIndexState {
  switch (action.type) {

    case UUIDIndexActionTypes.ADD: {
      return addToUUIDIndex(state, action as AddToUUIDIndexAction);
    }

    case UUIDIndexActionTypes.REMOVE_HREF: {
      return removeHrefFromUUIDIndex(state, action as RemoveHrefFromUUIDIndexAction)
    }

    default: {
      return state;
    }
  }
}

function addToUUIDIndex(state: UUIDIndexState, action: AddToUUIDIndexAction): UUIDIndexState {
  return Object.assign({}, state, {
    [action.payload.uuid]: action.payload.href
  });
}

function removeHrefFromUUIDIndex(state: UUIDIndexState, action: RemoveHrefFromUUIDIndexAction): UUIDIndexState {
  const newState = Object.create(null);
  for (const uuid in state) {
    if (state[uuid] !== action.payload) {
      newState[uuid] = state[uuid];
    }
  }
  return newState;
}
