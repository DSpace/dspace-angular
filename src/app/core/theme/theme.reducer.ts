import { Theme } from '../../../config/theme.inferface';
import { ThemeAction, ThemeActionTypes } from './theme.actions';

export interface ThemeState {
  theme: Theme
}

// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
const initialState = Object.create(null);

export function themeReducer(state = initialState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case ThemeActionTypes.SET: {
      const newState =  Object.assign({}, state, { theme: action.payload.theme });
      console.log(newState);
      return newState;
    }
  }
}
