import * as deepFreeze from 'deep-freeze';

import { navbarReducer } from './navbar.reducer';
import { NavbarCollapseAction, NavbarExpandAction, NavbarToggleAction } from './navbar.actions';

class NullAction extends NavbarCollapseAction {
  type = null;

  constructor() {
    super();
  }
}

describe('navbarReducer', () => {
  it('should return the current state when no valid actions have been made', () => {
    const state = { navCollapsed: false };
    const action = new NullAction();
    const newState = navbarReducer(state, action);

    expect(newState).toEqual(state);
  });

  it('should start with navCollapsed = true', () => {
    const action = new NullAction();
    const initialState = navbarReducer(undefined, action);

    // The navigation starts collapsed
    expect(initialState.navCollapsed).toEqual(true);
  });

  it('should set navCollapsed to true in response to the COLLAPSE action', () => {
    const state = { navCollapsed: false };
    const action = new NavbarCollapseAction();
    const newState = navbarReducer(state, action);

    expect(newState.navCollapsed).toEqual(true);
  });

  it('should perform the COLLAPSE action without affecting the previous state', () => {
    const state = { navCollapsed: false };
    deepFreeze(state);

    const action = new NavbarCollapseAction();
    navbarReducer(state, action);

    // no expect required, deepFreeze will ensure an exception is thrown if the state
    // is mutated, and any uncaught exception will cause the test to fail
  });

  it('should set navCollapsed to false in response to the EXPAND action', () => {
    const state = { navCollapsed: true };
    const action = new NavbarExpandAction();
    const newState = navbarReducer(state, action);

    expect(newState.navCollapsed).toEqual(false);
  });

  it('should perform the EXPAND action without affecting the previous state', () => {
    const state = { navCollapsed: true };
    deepFreeze(state);

    const action = new NavbarExpandAction();
    navbarReducer(state, action);
  });

  it('should flip the value of navCollapsed in response to the TOGGLE action', () => {
    const state1 = { navCollapsed: true };
    const action = new NavbarToggleAction();

    const state2 = navbarReducer(state1, action);
    const state3 = navbarReducer(state2, action);

    expect(state2.navCollapsed).toEqual(false);
    expect(state3.navCollapsed).toEqual(true);
  });

  it('should perform the TOGGLE action without affecting the previous state', () => {
    const state = { navCollapsed: true };
    deepFreeze(state);

    const action = new NavbarToggleAction();
    navbarReducer(state, action);
  });

});
