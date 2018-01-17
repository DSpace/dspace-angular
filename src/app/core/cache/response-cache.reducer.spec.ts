import * as deepFreeze from 'deep-freeze';

import { responseCacheReducer, ResponseCacheState } from './response-cache.reducer';

import {
  ResponseCacheRemoveAction,
  ResetResponseCacheTimestampsAction, ResponseCacheAddAction
} from './response-cache.actions';
import { RestResponse } from './response-cache.models';

class NullAction extends ResponseCacheRemoveAction {
  type = null;
  payload = null;

  constructor() {
    super(null);
  }
}

describe('responseCacheReducer', () => {
  const keys = ['125c17f89046283c5f0640722aac9feb', 'a06c3006a41caec5d635af099b0c780c'];
  const msToLive = 900000;
  const uuids = [
    '9e32a2e2-6b91-4236-a361-995ccdc14c60',
    '598ce822-c357-46f3-ab70-63724d02d6ad',
    'be8325f7-243b-49f4-8a4b-df2b793ff3b5'
  ];
  const testState: ResponseCacheState = {
    [keys[0]]: {
      key: keys[0],
      response: new RestResponse(true, '200'),
      timeAdded: new Date().getTime(),
      msToLive: msToLive
    },
    [keys[1]]: {
      key: keys[1],
      response: new RestResponse(true, '200'),
      timeAdded: new Date().getTime(),
      msToLive: msToLive
    }
  };
  deepFreeze(testState);
  const errorState: {} = {
    [keys[0]]: {
      errorMessage: 'error',
      resourceUUIDs: uuids
    }
  };
  deepFreeze(errorState);

  it('should return the current state when no valid actions have been made', () => {
    const action = new NullAction();
    const newState = responseCacheReducer(testState, action);

    expect(newState).toEqual(testState);
  });

  it('should start with an empty cache', () => {
    const action = new NullAction();
    const initialState = responseCacheReducer(undefined, action);

    expect(initialState).toEqual(Object.create(null));
  });

  describe('ADD', () => {
    const addTimeAdded = new Date().getTime();
    const addMsToLive = 5;
    const addResponse = new RestResponse(true, '200');
    const action = new ResponseCacheAddAction(keys[0], addResponse, addTimeAdded, addMsToLive);

    it('should perform the action without affecting the previous state', () => {
      // testState has already been frozen above
      responseCacheReducer(testState, action);
    });

    it('should add the response to the cached request', () => {
      const newState = responseCacheReducer(testState, action);
      expect(newState[keys[0]].timeAdded).toBe(addTimeAdded);
      expect(newState[keys[0]].msToLive).toBe(addMsToLive);
      expect(newState[keys[0]].response).toBe(addResponse);
    });
  });

  describe('REMOVE', () => {
    it('should perform the action without affecting the previous state', () => {
      const action = new ResponseCacheRemoveAction(keys[0]);
      // testState has already been frozen above
      responseCacheReducer(testState, action);
    });

    it('should remove the specified request from the cache', () => {
      const action = new ResponseCacheRemoveAction(keys[0]);
      const newState = responseCacheReducer(testState, action);
      expect(testState[keys[0]]).not.toBeUndefined();
      expect(newState[keys[0]]).toBeUndefined();
    });

    it('shouldn\'t do anything when the specified key isn\'t cached', () => {
      const wrongKey = 'this isn\'t cached';
      const action = new ResponseCacheRemoveAction(wrongKey);
      const newState = responseCacheReducer(testState, action);
      expect(testState[wrongKey]).toBeUndefined();
      expect(newState).toEqual(testState);
    });
  });

  describe('RESET_TIMESTAMPS', () => {
    const newTimeStamp = new Date().getTime();
    const action = new ResetResponseCacheTimestampsAction(newTimeStamp);

    it('should perform the action without affecting the previous state', () => {
      // testState has already been frozen above
      responseCacheReducer(testState, action);
    });

    it('should set the timestamp of all requests in the cache', () => {
      const newState = responseCacheReducer(testState, action);
      Object.keys(newState).forEach((key) => {
        expect(newState[key].timeAdded).toEqual(newTimeStamp);
      });
    });

  });
});
