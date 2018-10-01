import {
  ItemSelectionDeselectAction, ItemSelectionInitialDeselectAction,
  ItemSelectionInitialSelectAction, ItemSelectionResetAction,
  ItemSelectionSelectAction, ItemSelectionSwitchAction
} from './item-select.actions';
import { itemSelectionReducer } from './item-select.reducer';

const itemId1 = 'id1';
const itemId2 = 'id2';

class NullAction extends ItemSelectionSelectAction {
  type = null;

  constructor() {
    super(undefined);
  }
}

describe('itemSelectionReducer', () => {

  it('should return the current state when no valid actions have been made', () => {
    const state = {};
    state[itemId1] = { checked: true };
    const action = new NullAction();
    const newState = itemSelectionReducer(state, action);

    expect(newState).toEqual(state);
  });

  it('should start with an empty object', () => {
    const state = {};
    const action = new NullAction();
    const newState = itemSelectionReducer(undefined, action);

    expect(newState).toEqual(state);
  });

  it('should set checked to true in response to the INITIAL_SELECT action', () => {
    const action = new ItemSelectionInitialSelectAction(itemId1);
    const newState = itemSelectionReducer(undefined, action);

    expect(newState[itemId1].checked).toBeTruthy();
  });

  it('should set checked to true in response to the INITIAL_DESELECT action', () => {
    const action = new ItemSelectionInitialDeselectAction(itemId1);
    const newState = itemSelectionReducer(undefined, action);

    expect(newState[itemId1].checked).toBeFalsy();
  });

  it('should set checked to true in response to the SELECT action', () => {
    const state = {};
    state[itemId1] = { checked: false };
    const action = new ItemSelectionSelectAction(itemId1);
    const newState = itemSelectionReducer(state, action);

    expect(newState[itemId1].checked).toBeTruthy();
  });

  it('should set checked to false in response to the DESELECT action', () => {
    const state = {};
    state[itemId1] = { checked: true };
    const action = new ItemSelectionDeselectAction(itemId1);
    const newState = itemSelectionReducer(state, action);

    expect(newState[itemId1].checked).toBeFalsy();
  });

  it('should set checked from false to true in response to the SWITCH action', () => {
    const state = {};
    state[itemId1] = { checked: false };
    const action = new ItemSelectionSwitchAction(itemId1);
    const newState = itemSelectionReducer(state, action);

    expect(newState[itemId1].checked).toBeTruthy();
  });

  it('should set checked from true to false in response to the SWITCH action', () => {
    const state = {};
    state[itemId1] = { checked: true };
    const action = new ItemSelectionSwitchAction(itemId1);
    const newState = itemSelectionReducer(state, action);

    expect(newState[itemId1].checked).toBeFalsy();
  });

  it('should set reset the state in response to the RESET action', () => {
    const state = {};
    state[itemId1] = { checked: true };
    state[itemId2] = { checked: false };
    const action = new ItemSelectionResetAction(undefined);
    const newState = itemSelectionReducer(state, action);

    expect(newState).toEqual({});
  });

});
