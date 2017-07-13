import * as deepFreeze from 'deep-freeze';

import { objectCacheReducer } from './object-cache.reducer';
import {
  AddToObjectCacheAction,
  RemoveFromObjectCacheAction, ResetObjectCacheTimestampsAction
} from './object-cache.actions';

class NullAction extends RemoveFromObjectCacheAction {
  type = null;
  payload = null;

  constructor() {
    super(null);
  }
}

describe('objectCacheReducer', () => {
  const uuid1 = '1698f1d3-be98-4c51-9fd8-6bfedcbd59b7';
  const uuid2 = '28b04544-1766-4e82-9728-c4e93544ecd3';
  const testState = {
    [uuid1]: {
      data: {
        uuid: uuid1,
        foo: 'bar'
      },
      timeAdded: new Date().getTime(),
      msToLive: 900000,
      requestHref: 'https://rest.api/endpoint/uuid1'
    },
    [uuid2]: {
      data: {
        uuid: uuid2,
        foo: 'baz'
      },
      timeAdded: new Date().getTime(),
      msToLive: 900000,
      requestHref: 'https://rest.api/endpoint/uuid2'
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
    const objectToCache = { uuid: uuid1 };
    const timeAdded = new Date().getTime();
    const msToLive = 900000;
    const requestHref = 'https://rest.api/endpoint/uuid1';
    const action = new AddToObjectCacheAction(objectToCache, timeAdded, msToLive, requestHref);
    const newState = objectCacheReducer(state, action);

    expect(newState[uuid1].data).toEqual(objectToCache);
    expect(newState[uuid1].timeAdded).toEqual(timeAdded);
    expect(newState[uuid1].msToLive).toEqual(msToLive);
  });

  it('should overwrite an object in the cache in response to an ADD action if it already exists', () => {
    const objectToCache = { uuid: uuid1, foo: 'baz', somethingElse: true };
    const timeAdded = new Date().getTime();
    const msToLive = 900000;
    const requestHref = 'https://rest.api/endpoint/uuid1';
    const action = new AddToObjectCacheAction(objectToCache, timeAdded, msToLive, requestHref);
    const newState = objectCacheReducer(testState, action);

    /* tslint:disable:no-string-literal */
    expect(newState[uuid1].data['foo']).toBe('baz');
    expect(newState[uuid1].data['somethingElse']).toBe(true);
    /* tslint:enable:no-string-literal */
  });

  it('should perform the ADD action without affecting the previous state', () => {
    const state = Object.create(null);
    const objectToCache = { uuid: uuid1 };
    const timeAdded = new Date().getTime();
    const msToLive = 900000;
    const requestHref = 'https://rest.api/endpoint/uuid1';
    const action = new AddToObjectCacheAction(objectToCache, timeAdded, msToLive, requestHref);
    deepFreeze(state);

    objectCacheReducer(state, action);
  });

  it('should remove the specified object from the cache in response to the REMOVE action', () => {
    const action = new RemoveFromObjectCacheAction(uuid1);
    const newState = objectCacheReducer(testState, action);

    expect(testState[uuid1]).not.toBeUndefined();
    expect(newState[uuid1]).toBeUndefined();
  });

  it("shouldn't do anything in response to the REMOVE action for an object that isn't cached", () => {
    const wrongKey = "this isn't cached";
    const action = new RemoveFromObjectCacheAction(wrongKey);
    const newState = objectCacheReducer(testState, action);

    expect(testState[wrongKey]).toBeUndefined();
    expect(newState).toEqual(testState);
  });

  it('should perform the REMOVE action without affecting the previous state', () => {
    const action = new RemoveFromObjectCacheAction(uuid1);
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

});
