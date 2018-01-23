import {
  ObjectCacheAction, ObjectCacheActionTypes, AddToObjectCacheAction,
  RemoveFromObjectCacheAction, ResetObjectCacheTimestampsAction
} from './object-cache.actions';
import { hasValue } from '../../shared/empty.util';
import { CacheEntry } from './cache-entry';

export enum DirtyType {
  Created = 'Created',
  Updated = 'Updated',
  Deleted = 'Deleted'
}

/**
 * An interface to represent objects that can be cached
 *
 * A cacheable object should have a self link
 */
export interface CacheableObject {
  uuid?: string;
  self: string;
  // isNew: boolean;
  // dirtyType: DirtyType;
  // hasDirtyAttributes: boolean;
  // changedAttributes: AttributeDiffh;
  // save(): void;
}

/**
 * An entry in the ObjectCache
 */
export class ObjectCacheEntry implements CacheEntry {
  data: CacheableObject;
  timeAdded: number;
  msToLive: number;
  requestHref: string;
}

/**
 * The ObjectCache State
 *
 * Consists of a map with self links as keys,
 * and ObjectCacheEntries as values
 */
export interface ObjectCacheState {
  [href: string]: ObjectCacheEntry
}

// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
const initialState: ObjectCacheState = Object.create(null);

/**
 * The ObjectCache Reducer
 *
 * @param state
 *    the current state
 * @param action
 *    the action to perform on the state
 * @return ObjectCacheState
 *    the new state
 */
export function objectCacheReducer(state = initialState, action: ObjectCacheAction): ObjectCacheState {
  switch (action.type) {

    case ObjectCacheActionTypes.ADD: {
      return addToObjectCache(state, action as AddToObjectCacheAction);
    }

    case ObjectCacheActionTypes.REMOVE: {
      return removeFromObjectCache(state, action as RemoveFromObjectCacheAction)
    }

    case ObjectCacheActionTypes.RESET_TIMESTAMPS: {
      return resetObjectCacheTimestamps(state, action as ResetObjectCacheTimestampsAction)
    }

    default: {
      return state;
    }
  }
}

/**
 * Add an object to the cache
 *
 * @param state
 *    the current state
 * @param action
 *    an AddToObjectCacheAction
 * @return ObjectCacheState
 *    the new state, with the object added, or overwritten.
 */
function addToObjectCache(state: ObjectCacheState, action: AddToObjectCacheAction): ObjectCacheState {
  return Object.assign({}, state, {
    [action.payload.objectToCache.self]: {
      data: action.payload.objectToCache,
      timeAdded: action.payload.timeAdded,
      msToLive: action.payload.msToLive,
      requestHref: action.payload.requestHref
    }
  });
}

/**
 * Remove an object from the cache
 *
 * @param state
 *    the current state
 * @param action
 *    an RemoveFromObjectCacheAction
 * @return ObjectCacheState
 *    the new state, with the object removed if it existed.
 */
function removeFromObjectCache(state: ObjectCacheState, action: RemoveFromObjectCacheAction): ObjectCacheState {
  if (hasValue(state[action.payload])) {
    const newObjectCache = Object.assign({}, state);
    delete newObjectCache[action.payload];

    return newObjectCache;
  } else {
    return state;
  }
}

/**
 * Set the timeAdded timestamp of every cached object to the specified value
 *
 * @param state
 *    the current state
 * @param action
 *    a ResetObjectCacheTimestampsAction
 * @return ObjectCacheState
 *    the new state, with all timeAdded timestamps set to the specified value
 */
function resetObjectCacheTimestamps(state: ObjectCacheState, action: ResetObjectCacheTimestampsAction): ObjectCacheState {
  const newState = Object.create(null);
  Object.keys(state).forEach((key) => {
    newState[key] = Object.assign({}, state[key], {
      timeAdded: action.payload
    });
  });
  return newState;
}
