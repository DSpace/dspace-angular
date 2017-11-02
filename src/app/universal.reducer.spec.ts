import * as deepFreeze from 'deep-freeze';
import { universalReducer } from './universal.reducer';
import {
  UniversalAction, UniversalReplayAction,
  UniversalReplayCompleteAction
} from './universal.actions';
import { MockAction } from './shared/testing/mock-action';

describe('universalReducer', () => {
  const trueState = { isReplaying: true };
  const falseState = { isReplaying: false };

  it('should return the current state when no valid actions have been made', () => {
    const state = trueState;
    const action = new MockAction() as UniversalAction;
    const newState = universalReducer(state, action);

    expect(newState).toEqual(state);
  });

  it('should start with isReplaying = false', () => {
    const action = new MockAction() as UniversalAction;
    const initialState = universalReducer(undefined, action);

    expect(initialState.isReplaying).toEqual(false);
  });

  it('should set isReplaying to true in response to a REPLAY action', () => {
    const state = falseState;
    const action = new UniversalReplayAction([]);
    const newState = universalReducer(state, action);

    expect(newState.isReplaying).toEqual(true);
  });

  it('should set isReplaying to false in response to a REPLAY_COMPLETE action', () => {
    const state = trueState;
    const action = new UniversalReplayCompleteAction();
    const newState = universalReducer(state, action);

    expect(newState.isReplaying).toEqual(false);
  });

  it('should perform the REPLAY action without affecting the previous state', () => {
    const state = falseState;
    deepFreeze(state);

    const action = new UniversalReplayAction([]);
    universalReducer(state, action);
  });

  it('should perform the REPLAY_COMPLETE action without affecting the previous state', () => {
    const state = trueState;
    deepFreeze(state);

    const action = new UniversalReplayCompleteAction();
    universalReducer(state, action);
  });

});
