import * as deepFreeze from 'deep-freeze';
import { SetThemeAction } from './theme.actions';
import { themeReducer } from './theme.reducer';
import { Theme } from '../../../config/theme.inferface';

class NullAction extends SetThemeAction {
  type = null;
  payload = null;

  constructor() {
    super(null);
  }
}

const newTheme: Theme = { name: 'New theme', cssClass: 'new-class' };
describe('themeReducer', () => {
  const testState = { theme: { name: 'test theme', cssClass: 'test-class' } };
  deepFreeze(testState);

  it('should return the current state when no valid actions have been made', () => {
    const action = new NullAction();
    const newState = themeReducer(testState, action);

    expect(newState).toEqual(testState);
  });

  it('should start with an empty object', () => {
    const action = new NullAction();
    const initialState = themeReducer(undefined, action);

    expect(initialState).toEqual({} as any);
  });

  it('should perform the SET action without affecting the previous state', () => {
    const action = new SetThemeAction(newTheme);
    // testState has already been frozen above
    themeReducer(testState, action);
  });

  it('should return a new state with the new theme when calling the SET action with this new theme', () => {
    const action = new SetThemeAction(newTheme);

    const newState = themeReducer(testState, action);
    expect(newState.theme).toEqual(newTheme);
  });
});
