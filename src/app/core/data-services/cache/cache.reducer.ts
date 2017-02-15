import { CacheAction, CacheActionTypes, AddToCacheAction, RemoveFromCacheAction } from "./cache.actions";
import { hasValue } from "../../../shared/empty.util";

export interface CacheableObject {
  uuid: string;
}

export interface CacheEntry {
  data: CacheableObject;
  timeAdded: number;
  msToLive: number;
}

export interface CacheState {
  [uuid: string]: CacheEntry
}

// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
const initialState: CacheState = Object.create(null);

export const cacheReducer = (state = initialState, action: CacheAction): CacheState => {
  switch (action.type) {

    case CacheActionTypes.ADD: {
      return addToCache(state, <AddToCacheAction>action);
    }

    case CacheActionTypes.REMOVE: {
      return removeFromCache(state, <RemoveFromCacheAction>action)
    }

    default: {
      return state;
    }
  }
};

function addToCache(state: CacheState, action: AddToCacheAction): CacheState {
  return Object.assign({}, state, {
    [action.payload.objectToCache.uuid]: {
      data: action.payload.objectToCache,
      timeAdded: new Date().getTime(),
      msToLive: action.payload.msToLive
    }
  });
}

function removeFromCache(state: CacheState, action: RemoveFromCacheAction): CacheState {
  if (hasValue(state[action.payload])) {
    let newCache = Object.assign({}, state);
    delete newCache[action.payload];

    return newCache;
  }
  else {
    return state;
  }
}
