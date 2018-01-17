import * as deepFreeze from 'deep-freeze';

import { requestReducer, RequestState } from './request.reducer';
import {
  RequestCompleteAction, RequestConfigureAction, RequestExecuteAction
} from './request.actions';
import { GetRequest, RestRequest } from './request.models';

class NullAction extends RequestCompleteAction {
  type = null;
  payload = null;

  constructor() {
    super(null);
  }
}

describe('requestReducer', () => {
  const id1 = 'clients/eca2ea1d-6a6a-4f62-8907-176d5fec5014';
  const id2 = 'clients/eb7cde2e-a03f-4f0b-ac5d-888a4ef2b4eb';
  const link1 = 'https://dspace7.4science.it/dspace-spring-rest/api/core/items/567a639f-f5ff-4126-807c-b7d0910808c8';
  const link2 = 'https://dspace7.4science.it/dspace-spring-rest/api/core/items/1911e8a4-6939-490c-b58b-a5d70f8d91fb';
  const testState: RequestState = {
    [id1]: {
      request: new GetRequest(id1, link1),
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
    const request = new GetRequest(id2, link2);

    const action = new RequestConfigureAction(request);
    const newState = requestReducer(state, action);

    expect(newState[id2].request.uuid).toEqual(id2);
    expect(newState[id2].request.href).toEqual(link2);
    expect(newState[id2].requestPending).toEqual(true);
    expect(newState[id2].responsePending).toEqual(false);
    expect(newState[id2].completed).toEqual(false);
  });

  it('should set \'requestPending\' to false, \'responsePending\' to true and leave \'completed\' untouched for the given RestRequest in the state, in response to an EXECUTE action', () => {
    const state = testState;

    const action = new RequestExecuteAction(id1);
    const newState = requestReducer(state, action);

    expect(newState[id1].request.uuid).toEqual(id1);
    expect(newState[id1].request.href).toEqual(link1);
    expect(newState[id1].requestPending).toEqual(false);
    expect(newState[id1].responsePending).toEqual(true);
    expect(newState[id1].completed).toEqual(state[id1].completed);
  });
  it('should leave \'requestPending\' untouched, set \'responsePending\' to false and \'completed\' to true for the given RestRequest in the state, in response to a COMPLETE action', () => {
    const state = testState;

    const action = new RequestCompleteAction(id1);
    const newState = requestReducer(state, action);

    expect(newState[id1].request.uuid).toEqual(id1);
    expect(newState[id1].request.href).toEqual(link1);
    expect(newState[id1].requestPending).toEqual(state[id1].requestPending);
    expect(newState[id1].responsePending).toEqual(false);
    expect(newState[id1].completed).toEqual(true);
  });
});
