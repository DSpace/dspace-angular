import { Theme } from '../../../config/theme.inferface';
import { ThemeAction, ThemeActionTypes } from './theme.actions';

/**
 * Represents the state of the current theme in the store
 */
export interface ThemeState {
  theme: Theme
}

// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
const initialState = Object.create(null);

/**
 * Reducer the current theme state to the new state depending on a given action
 * @param state The previous state, equal to the initial state when it was not defined before
 * @param action The action to perform on the current theme state
 */
export function themeReducer(state = initialState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case ThemeActionTypes.SET: {
      return Object.assign({}, state, { theme: action.payload.theme });
    }
  }
  return state;
}
