import { ObjectCacheAction, ObjectCacheActionTypes, AddToObjectCacheAction, RemoveFromObjectCacheAction } from "./object-cache.actions";
import { hasValue } from "../../shared/empty.util";

export interface CacheableObject {
  uuid: string;
}

export interface ObjectCacheEntry {
  data: CacheableObject;
  timeAdded: number;
  msToLive: number;
}

export interface ObjectCacheState {
  [uuid: string]: ObjectCacheEntry
}

// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
const initialState: ObjectCacheState = Object.create(null);

export const objectCacheReducer = (state = initialState, action: ObjectCacheAction): ObjectCacheState => {
  switch (action.type) {

    case ObjectCacheActionTypes.ADD: {
      return addToObjectCache(state, <AddToObjectCacheAction>action);
    }

    case ObjectCacheActionTypes.REMOVE: {
      return removeFromObjectCache(state, <RemoveFromObjectCacheAction>action)
    }

    default: {
      return state;
    }
  }
};

function addToObjectCache(state: ObjectCacheState, action: AddToObjectCacheAction): ObjectCacheState {
  return Object.assign({}, state, {
    [action.payload.objectToCache.uuid]: {
      data: action.payload.objectToCache,
      timeAdded: new Date().getTime(),
      msToLive: action.payload.msToLive
    }
  });
}

function removeFromObjectCache(state: ObjectCacheState, action: RemoveFromObjectCacheAction): ObjectCacheState {
  if (hasValue(state[action.payload])) {
    let newObjectCache = Object.assign({}, state);
    delete newObjectCache[action.payload];

    return newObjectCache;
  }
  else {
    return state;
  }
}
