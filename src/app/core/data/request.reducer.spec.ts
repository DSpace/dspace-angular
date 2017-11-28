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

  it('should start with an empty cache', () => {
    const action = new NullAction();
    const initialState = requestReducer(undefined, action);

    expect(initialState).toEqual(Object.create(null));
  });

  it('should add the new RestRequest and set \'requestPending\' to true, \'responsePending\' to false and \'completed\' to false for the given RestRequest in the state, in response to an CONFIGURE action', () => {
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
  it('should leave \'requestPending\' untouched, set \'responsePending\' to false and \'completed\' to false for the given RestRequest in the state, in response to an COMPLETE action', () => {
    const state = testState;

    const action = new RequestCompleteAction(link1);
    const newState = requestReducer(state, action);

    expect(newState[link1].request.href).toEqual(link1);
    expect(newState[link1].requestPending).toEqual(state[link1].requestPending);
    expect(newState[link1].responsePending).toEqual(false);
    expect(newState[link1].completed).toEqual(true);
  });

  //
  // it('should overwrite an object in the cache in response to an ADD action if it already exists', () => {
  //   const objectToCache = { self: selfLink1, foo: 'baz', somethingElse: true };
  //   const timeAdded = new Date().getTime();
  //   const msToLive = 900000;
  //   const requestHref = 'https://rest.api/endpoint/selfLink1';
  //   const action = new AddToObjectCacheAction(objectToCache, timeAdded, msToLive, requestHref);
  //   const newState = requestReducer(testState, action);
  //
  //   /* tslint:disable:no-string-literal */
  //   expect(newState[selfLink1].data['foo']).toBe('baz');
  //   expect(newState[selfLink1].data['somethingElse']).toBe(true);
  //   /* tslint:enable:no-string-literal */
  // });
  //
  // it('should perform the ADD action without affecting the previous state', () => {
  //   const state = Object.create(null);
  //   const objectToCache = { self: selfLink1 };
  //   const timeAdded = new Date().getTime();
  //   const msToLive = 900000;
  //   const requestHref = 'https://rest.api/endpoint/selfLink1';
  //   const action = new AddToObjectCacheAction(objectToCache, timeAdded, msToLive, requestHref);
  //   deepFreeze(state);
  //
  //   requestReducer(state, action);
  // });
  //
  // it('should remove the specified object from the cache in response to the REMOVE action', () => {
  //   const action = new RemoveFromObjectCacheAction(selfLink1);
  //   const newState = requestReducer(testState, action);
  //
  //   expect(testState[selfLink1]).not.toBeUndefined();
  //   expect(newState[selfLink1]).toBeUndefined();
  // });
  //
  // it("shouldn't do anything in response to the REMOVE action for an object that isn't cached", () => {
  //   const wrongKey = "this isn't cached";
  //   const action = new RemoveFromObjectCacheAction(wrongKey);
  //   const newState = requestReducer(testState, action);
  //
  //   expect(testState[wrongKey]).toBeUndefined();
  //   expect(newState).toEqual(testState);
  // });
  //
  // it('should perform the REMOVE action without affecting the previous state', () => {
  //   const action = new RemoveFromObjectCacheAction(selfLink1);
  //   // testState has already been frozen above
  //   requestReducer(testState, action);
  // });
  //
  // it('should set the timestamp of all objects in the cache in response to a RESET_TIMESTAMPS action', () => {
  //   const newTimestamp = new Date().getTime();
  //   const action = new ResetObjectCacheTimestampsAction(newTimestamp);
  //   const newState = requestReducer(testState, action);
  //   Object.keys(newState).forEach((key) => {
  //     expect(newState[key].timeAdded).toEqual(newTimestamp);
  //   });
  // });
  //
  // it('should perform the RESET_TIMESTAMPS action without affecting the previous state', () => {
  //   const action = new ResetObjectCacheTimestampsAction(new Date().getTime());
  //   // testState has already been frozen above
  //   requestReducer(testState, action);
  // });

});
