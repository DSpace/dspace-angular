import { StoreActionTypes } from './store.actions';

// fallback ngrx debugger
let actionCounter = 0;

export function debugMetaReducer(reducer) {
  return (state, action) => {
    actionCounter++;
    return reducer(state, action);
  };
}

export function universalMetaReducer(reducer) {
  return (state, action) => {
    switch (action.type) {
      case StoreActionTypes.REHYDRATE:
        state = Object.assign({}, state, action.payload);
        break;
      case StoreActionTypes.REPLAY:
      default:
        break;
    }
    return reducer(state, action);
  };
}

export const debugMetaReducers = [
  debugMetaReducer,
];

export const appMetaReducers = [
  universalMetaReducer,
];
