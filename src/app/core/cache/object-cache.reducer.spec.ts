import * as deepFreeze from 'deep-freeze';

import { objectCacheReducer } from './object-cache.reducer';
import {
  AddPatchObjectCacheAction,
  AddToObjectCacheAction,
  ApplyPatchObjectCacheAction,
  RemoveFromObjectCacheAction,
  ResetObjectCacheTimestampsAction
} from './object-cache.actions';
import { Operation } from 'fast-json-patch';

class NullAction extends RemoveFromObjectCacheAction {
  type = null;
  payload = null;

  constructor() {
    super(null);
  }
}

describe('objectCacheReducer', () => {
  const requestUUID1 = '8646169a-a8fc-4b31-a368-384c07867eb1';
  const requestUUID2 = 'bd36820b-4bf7-4d58-bd80-b832058b7279';
  const selfLink1 = 'https://localhost:8080/api/core/items/1698f1d3-be98-4c51-9fd8-6bfedcbd59b7';
  const selfLink2 = 'https://localhost:8080/api/core/items/28b04544-1766-4e82-9728-c4e93544ecd3';
  const newName = 'new different name';
  const testState = {
    [selfLink1]: {
      data: {
        self: selfLink1,
        foo: 'bar'
      },
      timeAdded: new Date().getTime(),
      msToLive: 900000,
      requestUUID: requestUUID1,
      patches: [],
      isDirty: false
    },
    [selfLink2]: {
      data: {
        self: requestUUID2,
        foo: 'baz'
      },
      timeAdded: new Date().getTime(),
      msToLive: 900000,
      requestUUID: selfLink2,
      patches: [],
      isDirty: false
    }
  };
  deepFreeze(testState);

  it('should return the current state when no valid actions have been made', () => {
    const action = new NullAction();
    const newState = objectCacheReducer(testState, action);

    expect(newState).toEqual(testState);
  });

  it('should start with an empty cache', () => {
    const action = new NullAction();
    const initialState = objectCacheReducer(undefined, action);

    expect(initialState).toEqual(Object.create(null));
  });

  it('should add the payload to the cache in response to an ADD action', () => {
    const state = Object.create(null);
    const objectToCache = { self: selfLink1 };
    const timeAdded = new Date().getTime();
    const msToLive = 900000;
    const requestUUID = requestUUID1;
    const action = new AddToObjectCacheAction(objectToCache, timeAdded, msToLive, requestUUID);
    const newState = objectCacheReducer(state, action);

    expect(newState[selfLink1].data).toEqual(objectToCache);
    expect(newState[selfLink1].timeAdded).toEqual(timeAdded);
    expect(newState[selfLink1].msToLive).toEqual(msToLive);
  });

  it('should overwrite an object in the cache in response to an ADD action if it already exists', () => {
    const objectToCache = { self: selfLink1, foo: 'baz', somethingElse: true };
    const timeAdded = new Date().getTime();
    const msToLive = 900000;
    const requestUUID = requestUUID1;
    const action = new AddToObjectCacheAction(objectToCache, timeAdded, msToLive, requestUUID);
    const newState = objectCacheReducer(testState, action);

    /* tslint:disable:no-string-literal */
    expect(newState[selfLink1].data['foo']).toBe('baz');
    expect(newState[selfLink1].data['somethingElse']).toBe(true);
    /* tslint:enable:no-string-literal */
  });

  it('should perform the ADD action without affecting the previous state', () => {
    const state = Object.create(null);
    const objectToCache = { self: selfLink1 };
    const timeAdded = new Date().getTime();
    const msToLive = 900000;
    const requestUUID = requestUUID1;
    const action = new AddToObjectCacheAction(objectToCache, timeAdded, msToLive, requestUUID);
    deepFreeze(state);

    objectCacheReducer(state, action);
  });

  it('should remove the specified object from the cache in response to the REMOVE action', () => {
    const action = new RemoveFromObjectCacheAction(selfLink1);
    const newState = objectCacheReducer(testState, action);

    expect(testState[selfLink1]).not.toBeUndefined();
    expect(newState[selfLink1]).toBeUndefined();
  });

  it("shouldn't do anything in response to the REMOVE action for an object that isn't cached", () => {
    const wrongKey = "this isn't cached";
    const action = new RemoveFromObjectCacheAction(wrongKey);
    const newState = objectCacheReducer(testState, action);

    expect(testState[wrongKey]).toBeUndefined();
    expect(newState).toEqual(testState);
  });

  it('should perform the REMOVE action without affecting the previous state', () => {
    const action = new RemoveFromObjectCacheAction(selfLink1);
    // testState has already been frozen above
    objectCacheReducer(testState, action);
  });

  it('should set the timestamp of all objects in the cache in response to a RESET_TIMESTAMPS action', () => {
    const newTimestamp = new Date().getTime();
    const action = new ResetObjectCacheTimestampsAction(newTimestamp);
    const newState = objectCacheReducer(testState, action);
    Object.keys(newState).forEach((key) => {
      expect(newState[key].timeAdded).toEqual(newTimestamp);
    });
  });

  it('should perform the RESET_TIMESTAMPS action without affecting the previous state', () => {
    const action = new ResetObjectCacheTimestampsAction(new Date().getTime());
    // testState has already been frozen above
    objectCacheReducer(testState, action);
  });

  it('should perform the ADD_PATCH action without affecting the previous state', () => {
    const action = new AddPatchObjectCacheAction(selfLink1, [{
      op: 'replace',
      path: '/name',
      value: 'random string'
    }]);
    // testState has already been frozen above
    objectCacheReducer(testState, action);
  });

  it('should when the ADD_PATCH action dispatched', () => {
    const patch = [{ op: 'add', path: '/name', value: newName } as Operation];
    const action = new AddPatchObjectCacheAction(selfLink1, patch);
    const newState = objectCacheReducer(testState, action);
    expect(newState[selfLink1].patches.map((p) => p.operations)).toContain(patch);
  });

  it('should when the APPLY_PATCH action dispatched', () => {
    const patch = [{ op: 'add', path: '/name', value: newName } as Operation];
    const addPatchAction = new AddPatchObjectCacheAction(selfLink1, patch);
    const stateWithPatch = objectCacheReducer(testState, addPatchAction);

    const action = new ApplyPatchObjectCacheAction(selfLink1);
    const newState = objectCacheReducer(stateWithPatch, action);
    expect(newState[selfLink1].patches).toEqual([]);
    expect((newState[selfLink1].data as any).name).toEqual(newName);
  });

});
