import { isNotEmpty } from './shared/empty.util';
import { StoreActionTypes } from './store.actions';

// fallback ngrx debugger
let actionCounter = 0;

export function debugMetaReducer(reducer) {
  return (state, action) => {
    if (isNotEmpty(console.debug)) {
      actionCounter++;
      console.debug('@ngrx action', actionCounter, action.type);
      console.debug('state', state);
      console.debug('action', action);
      console.debug('------------------------------------');
    }

    return reducer(state, action);
  }
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
  }
}

export const appMetaReducers = [
  // debugMetaReducer,
  universalMetaReducer,
];
