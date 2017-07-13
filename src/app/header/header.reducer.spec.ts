import * as deepFreeze from 'deep-freeze';

import { headerReducer } from './header.reducer';
import {
  HeaderCollapseAction,
  HeaderExpandAction,
  HeaderToggleAction
} from './header.actions';

class NullAction extends HeaderCollapseAction {
  type = null;

  constructor() {
    super();
  }
}

describe('headerReducer', () => {
  it('should return the current state when no valid actions have been made', () => {
    const state = { navCollapsed: false };
    const action = new NullAction();
    const newState = headerReducer(state, action);

    expect(newState).toEqual(state);
  });

  it('should start with navCollapsed = true', () => {
    const action = new NullAction();
    const initialState = headerReducer(undefined, action);

    // The navigation starts collapsed
    expect(initialState.navCollapsed).toEqual(true);
  });

  it('should set navCollapsed to true in response to the COLLAPSE action', () => {
    const state = { navCollapsed: false };
    const action = new HeaderCollapseAction();
    const newState = headerReducer(state, action);

    expect(newState.navCollapsed).toEqual(true);
  });

  it('should perform the COLLAPSE action without affecting the previous state', () => {
    const state = { navCollapsed: false };
    deepFreeze(state);

    const action = new HeaderCollapseAction();
    headerReducer(state, action);

    // no expect required, deepFreeze will ensure an exception is thrown if the state
    // is mutated, and any uncaught exception will cause the test to fail
  });

  it('should set navCollapsed to false in response to the EXPAND action', () => {
    const state = { navCollapsed: true };
    const action = new HeaderExpandAction();
    const newState = headerReducer(state, action);

    expect(newState.navCollapsed).toEqual(false);
  });

  it('should perform the EXPAND action without affecting the previous state', () => {
    const state = { navCollapsed: true };
    deepFreeze(state);

    const action = new HeaderExpandAction();
    headerReducer(state, action);
  });

  it('should flip the value of navCollapsed in response to the TOGGLE action', () => {
    const state1 = { navCollapsed: true };
    const action = new HeaderToggleAction();

    const state2 = headerReducer(state1, action);
    const state3 = headerReducer(state2, action);

    expect(state2.navCollapsed).toEqual(false);
    expect(state3.navCollapsed).toEqual(true);
  });

  it('should perform the TOGGLE action without affecting the previous state', () => {
    const state = { navCollapsed: true };
    deepFreeze(state);

    const action = new HeaderToggleAction();
    headerReducer(state, action);
  });

});
