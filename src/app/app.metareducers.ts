import { StoreActionTypes } from './store.actions';
import { initialMenusState } from './shared/menu/initial-menus-state';

// fallback ngrx debugger
let actionCounter = 0;

export function debugMetaReducer(reducer) {
  return (state, action) => {
    actionCounter++;
    console.log('@ngrx action', actionCounter, action.type);
    console.log('state', JSON.stringify(state));
    console.log('action', JSON.stringify(action));
    console.log('------------------------------------');
    return reducer(state, action);
  };
}

export function universalMetaReducer(reducer) {
  return (state, action) => {
    switch (action.type) {
      case StoreActionTypes.REHYDRATE:
        state = Object.assign({}, state, action.payload, {
          /**
           * Reset menus after the store is rehydrated, in order to force them to be recreated client side.
           * The reason is that menu options stored on the server may contain methods that don't survive the
           * (de)serialization to/from JSON
           */
          menus: initialMenusState
        });
        break;
      case StoreActionTypes.REPLAY:
      default:
        break;
    }
    return reducer(state, action);
  };
}

export const debugMetaReducers = [
  debugMetaReducer
];

export const appMetaReducers = [
  universalMetaReducer
];
