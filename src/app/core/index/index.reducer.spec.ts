import * as deepFreeze from 'deep-freeze';

import { getIdentiferByIndexName, IdentifierType, indexReducer, MetaIndexState, REQUEST, } from './index.reducer';
import { AddToIndexAction, RemoveFromIndexBySubstringAction, RemoveFromIndexByValueAction } from './index.actions';

class NullAction extends AddToIndexAction {
  type = null;
  payload = null;

  constructor() {
    super(null, null, null);
  }
}

describe('requestReducer', () => {
  const key1 = '567a639f-f5ff-4126-807c-b7d0910808c8';
  const key2 = '1911e8a4-6939-490c-b58b-a5d70f8d91fb';
  const key3 = '123456789/22';
  const val1 = 'https://dspace7.4science.it/dspace-spring-rest/api/core/items/567a639f-f5ff-4126-807c-b7d0910808c8';
  const val2 = 'https://dspace7.4science.it/dspace-spring-rest/api/core/items/1911e8a4-6939-490c-b58b-a5d70f8d91fb';
  const uuidIndex = getIdentiferByIndexName(IdentifierType.UUID);
  const handleIndex = getIdentiferByIndexName(IdentifierType.HANDLE);
  const testState: MetaIndexState = {
    'object/uuid-to-self-link/uuid': {
      [key1]: val1
    },'object/uuid-to-self-link/handle': {
      [key3]: val1
    },'get-request/href-to-uuid': {
      [key1]: val1
    },'get-request/configured-to-cache-uuid': {
      [key1]: val1
    }
  };
  deepFreeze(testState);

  it('should return the current state when no valid actions have been made', () => {
    const action = new NullAction();
    const newState = indexReducer(testState, action);

    expect(newState).toEqual(testState);
  });

  it('should start with an empty state', () => {
    const action = new NullAction();
    const initialState = indexReducer(undefined, action);

    expect(initialState).toEqual(Object.create(null));
  });

  it('should add the \'key\' with the corresponding \'value\' to the correct substate, in response to an ADD action', () => {
    const state = testState;

    const action = new AddToIndexAction(REQUEST, key2, val2);
    const newState = indexReducer(state, action);

    expect(newState[REQUEST][key2]).toEqual(val2);
  });

  it('should remove the given \'value\' from its corresponding \'key\' in the correct substate, in response to a REMOVE_BY_VALUE action', () => {
    const state = testState;

    let action = new RemoveFromIndexByValueAction(uuidIndex, val1);
    let newState = indexReducer(state, action);

    expect(newState[uuidIndex][key1]).toBeUndefined();

    action =  new RemoveFromIndexByValueAction(handleIndex, val1);
    newState = indexReducer(state, action);

    expect(newState[handleIndex][key3]).toBeUndefined();

  });

  it('should remove the given \'value\' from its corresponding \'key\' in the correct substate, in response to a REMOVE_BY_SUBSTRING action', () => {
    const state = testState;

    let action = new RemoveFromIndexBySubstringAction(uuidIndex, key1);
    let newState = indexReducer(state, action);

    expect(newState[uuidIndex][key1]).toBeUndefined();

    action = new RemoveFromIndexBySubstringAction(handleIndex, key3);
    newState = indexReducer(state, action);

    expect(newState[uuidIndex][key3]).toBeUndefined();
  });
});
