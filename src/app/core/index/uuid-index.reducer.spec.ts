import * as deepFreeze from 'deep-freeze';

import { uuidIndexReducer, UUIDIndexState } from './uuid-index.reducer';
import { AddToUUIDIndexAction, RemoveHrefFromUUIDIndexAction } from './uuid-index.actions';

class NullAction extends AddToUUIDIndexAction {
  type = null;
  payload = null;

  constructor() {
    super(null, null);
  }
}

describe('requestReducer', () => {
  const link1 = 'https://dspace7.4science.it/dspace-spring-rest/api/core/items/567a639f-f5ff-4126-807c-b7d0910808c8';
  const link2 = 'https://dspace7.4science.it/dspace-spring-rest/api/core/items/1911e8a4-6939-490c-b58b-a5d70f8d91fb';
  const uuid1 = '567a639f-f5ff-4126-807c-b7d0910808c8';
  const uuid2 = '1911e8a4-6939-490c-b58b-a5d70f8d91fb';
  const testState: UUIDIndexState = {
    [uuid1]: link1
  };
  deepFreeze(testState);

  it('should return the current state when no valid actions have been made', () => {
    const action = new NullAction();
    const newState = uuidIndexReducer(testState, action);

    expect(newState).toEqual(testState);
  });

  it('should start with an empty state', () => {
    const action = new NullAction();
    const initialState = uuidIndexReducer(undefined, action);

    expect(initialState).toEqual(Object.create(null));
  });

  it('should add the \'uuid\' with the corresponding \'href\' to the state, in response to an ADD action', () => {
    const state = testState;

    const action = new AddToUUIDIndexAction(uuid2, link2);
    const newState = uuidIndexReducer(state, action);

    expect(newState[uuid2]).toEqual(link2);
  });

  it('should remove the given \'href\' from its corresponding \'uuid\' in the state, in response to a REMOVE_HREF action', () => {
    const state = testState;

    const action = new RemoveHrefFromUUIDIndexAction(link1);
    const newState = uuidIndexReducer(state, action);

    expect(newState[uuid1]).toBeUndefined();
  });
});
