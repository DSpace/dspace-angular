import * as deepFreeze from "deep-freeze";
import { objectCacheReducer } from "./object-cache.reducer";
import {
  AddToObjectCacheAction,
  RemoveFromObjectCacheAction
} from "./object-cache.actions";

class NullAction extends RemoveFromObjectCacheAction {
  type = null;
  payload = null;

  constructor() {
    super(null);
  }
}

describe("objectCacheReducer", () => {
  const uuid = '1698f1d3-be98-4c51-9fd8-6bfedcbd59b7';
  const testState = {
    [uuid]: {
      data: {
        uuid: uuid,
        foo: "bar"
      },
      timeAdded: new Date().getTime(),
      msToLive: 900000
    }
  };
  deepFreeze(testState);

  it("should return the current state when no valid actions have been made", () => {
    const action = new NullAction();
    const newState = objectCacheReducer(testState, action);

    expect(newState).toEqual(testState);
  });

  it("should start with an empty cache", () => {
    const action = new NullAction();
    const initialState = objectCacheReducer(undefined, action);

    expect(initialState).toEqual(Object.create(null));
  });

  it("should add the payload to the cache in response to an ADD action", () => {
    const state = Object.create(null);
    const objectToCache = {uuid: uuid};
    const timeAdded = new Date().getTime();
    const msToLive = 900000;
    const action = new AddToObjectCacheAction(objectToCache, timeAdded, msToLive);
    const newState = objectCacheReducer(state, action);

    expect(newState[uuid].data).toEqual(objectToCache);
    expect(newState[uuid].timeAdded).toEqual(timeAdded);
    expect(newState[uuid].msToLive).toEqual(msToLive);
  });

  it("should overwrite an object in the cache in response to an ADD action if it already exists", () => {
    const objectToCache = {uuid: uuid, foo: "baz", somethingElse: true};
    const timeAdded = new Date().getTime();
    const msToLive = 900000;
    const action = new AddToObjectCacheAction(objectToCache, timeAdded, msToLive);
    const newState = objectCacheReducer(testState, action);

    expect(newState[uuid].data['foo']).toBe("baz");
    expect(newState[uuid].data['somethingElse']).toBe(true);
  });

  it("should perform the ADD action without affecting the previous state", () => {
    const state = Object.create(null);
    const objectToCache = {uuid: uuid};
    const timeAdded = new Date().getTime();
    const msToLive = 900000;
    const action = new AddToObjectCacheAction(objectToCache, timeAdded, msToLive);
    deepFreeze(state);

    objectCacheReducer(state, action);
  });

  it("should remove the specified object from the cache in response to the REMOVE action", () => {
    const action = new RemoveFromObjectCacheAction(uuid);
    const newState = objectCacheReducer(testState, action);

    expect(testState[uuid]).not.toBeUndefined();
    expect(newState[uuid]).toBeUndefined();
  });

  it("shouldn't do anything in response to the REMOVE action for an object that isn't cached", () => {
    const action = new RemoveFromObjectCacheAction("this isn't cached");
    const newState = objectCacheReducer(testState, action);

    expect(newState).toEqual(testState);
  });

  it("should perform the REMOVE action without affecting the previous state", () => {
    const action = new RemoveFromObjectCacheAction(uuid);
    //testState has already been frozen above
    objectCacheReducer(testState, action);
  });

});
