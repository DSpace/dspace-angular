import * as deepFreeze from 'deep-freeze';

import { requestReducer, RequestState } from './request.reducer';
import {
  RequestCompleteAction, RequestConfigureAction, RequestExecuteAction
} from './request.actions';
import { RestRequest } from './request.models';

class NullAction extends RequestCompleteAction {
  type = null;
  payload = null;

  constructor() {
    super(null);
  }
}

describe('requestReducer', () => {
  const link1 = 'https://dspace7.4science.it/dspace-spring-rest/api/core/items/567a639f-f5ff-4126-807c-b7d0910808c8';
  const link2 = 'https://dspace7.4science.it/dspace-spring-rest/api/core/items/1911e8a4-6939-490c-b58b-a5d70f8d91fb';
  const testState: RequestState = {
    [link1]: {
      request: new RestRequest(link1),
      requestPending: false,
      responsePending: false,
      completed: false
    }
  };
  deepFreeze(testState);

  it('should return the current state when no valid actions have been made', () => {
    const action = new NullAction();
    const newState = requestReducer(testState, action);

    expect(newState).toEqual(testState);
  });

  it('should start with an empty state', () => {
    const action = new NullAction();
    const initialState = requestReducer(undefined, action);

    expect(initialState).toEqual(Object.create(null));
  });

  it('should add the new RestRequest and set \'requestPending\' to true, \'responsePending\' to false and \'completed\' to false for the given RestRequest in the state, in response to a CONFIGURE action', () => {
    const state = testState;
    const request = new RestRequest(link2);

    const action = new RequestConfigureAction(request);
    const newState = requestReducer(state, action);

    expect(newState[link2].request.href).toEqual(link2);
    expect(newState[link2].requestPending).toEqual(true);
    expect(newState[link2].responsePending).toEqual(false);
    expect(newState[link2].completed).toEqual(false);
  });

  it('should set \'requestPending\' to false, \'responsePending\' to false and leave \'completed\' untouched for the given RestRequest in the state, in response to an EXECUTE action', () => {
    const state = testState;

    const action = new RequestExecuteAction(link1);
    const newState = requestReducer(state, action);

    expect(newState[link1].request.href).toEqual(link1);
    expect(newState[link1].requestPending).toEqual(false);
    expect(newState[link1].responsePending).toEqual(true);
    expect(newState[link1].completed).toEqual(state[link1].completed);
  });
  it('should leave \'requestPending\' untouched, set \'responsePending\' to false and \'completed\' to false for the given RestRequest in the state, in response to a COMPLETE action', () => {
    const state = testState;

    const action = new RequestCompleteAction(link1);
    const newState = requestReducer(state, action);

    expect(newState[link1].request.href).toEqual(link1);
    expect(newState[link1].requestPending).toEqual(state[link1].requestPending);
    expect(newState[link1].responsePending).toEqual(false);
    expect(newState[link1].completed).toEqual(true);
  });
});
