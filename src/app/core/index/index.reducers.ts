import { combineReducers } from '@ngrx/store';

import { HrefIndexState, hrefIndexReducer } from './href-index.reducer';

export interface IndexState {
  href: HrefIndexState
}

export const reducers = {
  href: hrefIndexReducer
};

export function indexReducer(state: any, action: any) {
  return combineReducers(reducers)(state, action);
}
