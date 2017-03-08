import { requestCacheReducer, RequestCacheState } from "./request-cache.reducer";
import {
  RequestCacheRemoveAction, RequestCacheFindByIDAction,
  RequestCacheFindAllAction, RequestCacheSuccessAction, RequestCacheErrorAction,
  ResetRequestCacheTimestampsAction
} from "./request-cache.actions";
import deepFreeze = require("deep-freeze");
import { OpaqueToken } from "@angular/core";

class NullAction extends RequestCacheRemoveAction {
  type = null;
  payload = null;

  constructor() {
    super(null);
  }
}

describe("requestCacheReducer", () => {
  const keys = ["125c17f89046283c5f0640722aac9feb", "a06c3006a41caec5d635af099b0c780c"];
  const services = [new OpaqueToken('service1'), new OpaqueToken('service2')];
  const msToLive = 900000;
  const uuids = [
    "9e32a2e2-6b91-4236-a361-995ccdc14c60",
    "598ce822-c357-46f3-ab70-63724d02d6ad",
    "be8325f7-243b-49f4-8a4b-df2b793ff3b5"
  ];
  const resourceID = "9978";
  const paginationOptions = { "resultsPerPage": 10, "currentPage": 1 };
  const sortOptions = { "field": "id", "direction": 0 };
  const testState = {
    [keys[0]]: {
      "key": keys[0],
      "service": services[0],
      "resourceUUIDs": [uuids[0], uuids[1]],
      "isLoading": false,
      "paginationOptions": paginationOptions,
      "sortOptions": sortOptions,
      "timeAdded": new Date().getTime(),
      "msToLive": msToLive
    },
    [keys[1]]: {
      "key": keys[1],
      "service": services[1],
      "resourceID": resourceID,
      "resourceUUIDs": [uuids[2]],
      "isLoading": false,
      "timeAdded": new Date().getTime(),
      "msToLive": msToLive
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


  it("should return the current state when no valid actions have been made", () => {
    const action = new NullAction();
    const newState = requestCacheReducer(testState, action);

    expect(newState).toEqual(testState);
  });

  it("should start with an empty cache", () => {
    const action = new NullAction();
    const initialState = requestCacheReducer(undefined, action);

    expect(initialState).toEqual(Object.create(null));
  });

  describe("FIND_BY_ID", () => {
    const action = new RequestCacheFindByIDAction(keys[0], services[0], resourceID);

    it("should perform the action without affecting the previous state", () => {
      //testState has already been frozen above
      requestCacheReducer(testState, action);
    });

    it("should add the request to the cache", () => {
      const state = Object.create(null);
      const newState = requestCacheReducer(state, action);
      expect(newState[keys[0]].key).toBe(keys[0]);
      expect(newState[keys[0]].service).toEqual(services[0]);
      expect(newState[keys[0]].resourceID).toBe(resourceID);
    });

    it("should set isLoading to true", () => {
      const state = Object.create(null);
      const newState = requestCacheReducer(state, action);
      expect(newState[keys[0]].isLoading).toBe(true);
    });

    it("should remove any previous error message or resourceUUID for the request", () => {
      const newState = requestCacheReducer(errorState, action);
      expect(newState[keys[0]].resourceUUIDs.length).toBe(0);
      expect(newState[keys[0]].errorMessage).toBeUndefined();
    });
  });

  describe("FIND_ALL", () => {
    const action = new RequestCacheFindAllAction(keys[0], services[0], resourceID, paginationOptions, sortOptions);

    it("should perform the action without affecting the previous state", () => {
      //testState has already been frozen above
      requestCacheReducer(testState, action);
    });

    it("should add the request to the cache", () => {
      const state = Object.create(null);
      const newState = requestCacheReducer(state, action);
      expect(newState[keys[0]].key).toBe(keys[0]);
      expect(newState[keys[0]].service).toEqual(services[0]);
      expect(newState[keys[0]].scopeID).toBe(resourceID);
      expect(newState[keys[0]].paginationOptions).toEqual(paginationOptions);
      expect(newState[keys[0]].sortOptions).toEqual(sortOptions);
    });

    it("should set isLoading to true", () => {
      const state = Object.create(null);
      const newState = requestCacheReducer(state, action);
      expect(newState[keys[0]].isLoading).toBe(true);
    });

    it("should remove any previous error message or resourceUUIDs for the request", () => {
      const newState = requestCacheReducer(errorState, action);
      expect(newState[keys[0]].resourceUUIDs.length).toBe(0);
      expect(newState[keys[0]].errorMessage).toBeUndefined();
    });
  });

  describe("SUCCESS", () => {
    const successUUIDs = [uuids[0], uuids[2]];
    const successTimeAdded = new Date().getTime();
    const successMsToLive = 5;
    const action = new RequestCacheSuccessAction(keys[0], successUUIDs, successTimeAdded, successMsToLive);

    it("should perform the action without affecting the previous state", () => {
      //testState has already been frozen above
      requestCacheReducer(testState, action);
    });

    it("should add the response to the cached request", () => {
      const newState = requestCacheReducer(testState, action);
      expect(newState[keys[0]].resourceUUIDs).toBe(successUUIDs);
      expect(newState[keys[0]].timeAdded).toBe(successTimeAdded);
      expect(newState[keys[0]].msToLive).toBe(successMsToLive);
    });

    it("should set isLoading to false", () => {
      const newState = requestCacheReducer(testState, action);
      expect(newState[keys[0]].isLoading).toBe(false);
    });

    it("should remove any previous error message for the request", () => {
      const newState = requestCacheReducer(errorState, action);
      expect(newState[keys[0]].errorMessage).toBeUndefined();
    });
  });

  describe("ERROR", () => {
    const errorMsg = 'errorMsg';
    const action = new RequestCacheErrorAction(keys[0], errorMsg);

    it("should perform the action without affecting the previous state", () => {
      //testState has already been frozen above
      requestCacheReducer(testState, action);
    });

    it("should set an error message for the request", () => {
      const newState = requestCacheReducer(errorState, action);
      expect(newState[keys[0]].errorMessage).toBe(errorMsg);
    });

    it("should set isLoading to false", () => {
      const newState = requestCacheReducer(testState, action);
      expect(newState[keys[0]].isLoading).toBe(false);
    });
  });

  describe("REMOVE", () => {
    it("should perform the action without affecting the previous state", () => {
      const action = new RequestCacheRemoveAction(keys[0]);
      //testState has already been frozen above
      requestCacheReducer(testState, action);
    });

    it("should remove the specified request from the cache", () => {
      const action = new RequestCacheRemoveAction(keys[0]);
      const newState = requestCacheReducer(testState, action);
      expect(testState[keys[0]]).not.toBeUndefined();
      expect(newState[keys[0]]).toBeUndefined();
    });

    it("shouldn't do anything when the specified key isn't cached", () => {
      const wrongKey = "this isn't cached";
      const action = new RequestCacheRemoveAction(wrongKey);
      const newState = requestCacheReducer(testState, action);
      expect(testState[wrongKey]).toBeUndefined();
      expect(newState).toEqual(testState);
    });
  });

  describe("RESET_TIMESTAMPS", () => {
    const newTimeStamp = new Date().getTime();
    const action = new ResetRequestCacheTimestampsAction(newTimeStamp);

    it("should perform the action without affecting the previous state", () => {
      //testState has already been frozen above
      requestCacheReducer(testState, action);
    });

    it("should set the timestamp of all requests in the cache", () => {
      const newState = requestCacheReducer(testState, action);
      Object.keys(newState).forEach((key) => {
        expect(newState[key].timeAdded).toEqual(newTimeStamp);
      });
    });

  });


});
