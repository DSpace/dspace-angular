import {
  HrefIndexAction,
  HrefIndexActionTypes,
  AddToHrefIndexAction,
  RemoveUUIDFromHrefIndexAction
} from './href-index.actions';

export interface HrefIndexState {
  [href: string]: string
}

// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
const initialState: HrefIndexState = Object.create(null);

export function hrefIndexReducer(state = initialState, action: HrefIndexAction): HrefIndexState {
  switch (action.type) {

    case HrefIndexActionTypes.ADD: {
      return addToHrefIndex(state, action as AddToHrefIndexAction);
    }

    case HrefIndexActionTypes.REMOVE_UUID: {
      return removeUUIDFromHrefIndex(state, action as RemoveUUIDFromHrefIndexAction)
    }

    default: {
      return state;
    }
  }
}

function addToHrefIndex(state: HrefIndexState, action: AddToHrefIndexAction): HrefIndexState {
  return Object.assign({}, state, {
    [action.payload.href]: action.payload.uuid
  });
}

function removeUUIDFromHrefIndex(state: HrefIndexState, action: RemoveUUIDFromHrefIndexAction): HrefIndexState {
  const newState = Object.create(null);
  for (const href in state) {
    if (state[href] !== action.payload) {
      newState[href] = state[href];
    }
  }
  return newState;
}
