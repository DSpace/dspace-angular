import {
  ResponseCacheAction, ResponseCacheActionTypes,
  ResponseCacheRemoveAction, ResetResponseCacheTimestampsAction,
  ResponseCacheAddAction
} from './response-cache.actions';
import { CacheEntry } from './cache-entry';
import { hasValue } from '../../shared/empty.util';
import { Response } from './response-cache.models';

/**
 * An entry in the ResponseCache
 */
export class ResponseCacheEntry implements CacheEntry {
  key: string;
  response: Response;
  timeAdded: number;
  msToLive: number;
}

/**
 * The ResponseCache State
 */
export interface ResponseCacheState {
  [key: string]: ResponseCacheEntry
}

// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
const initialState = Object.create(null);

/**
 * The ResponseCache Reducer
 *
 * @param state
 *    the current state
 * @param action
 *    the action to perform on the state
 * @return ResponseCacheState
 *    the new state
 */
export function responseCacheReducer(state = initialState, action: ResponseCacheAction): ResponseCacheState {
  switch (action.type) {

    case ResponseCacheActionTypes.ADD: {
      return addToCache(state, action as ResponseCacheAddAction);
    }

    case ResponseCacheActionTypes.REMOVE: {
      return removeFromCache(state, action as ResponseCacheRemoveAction);
    }

    case ResponseCacheActionTypes.RESET_TIMESTAMPS: {
      return resetResponseCacheTimestamps(state, action as ResetResponseCacheTimestampsAction)
    }

    default: {
      return state;
    }
  }
}

function addToCache(state: ResponseCacheState, action: ResponseCacheAddAction): ResponseCacheState {
  return Object.assign({}, state, {
    [action.payload.key]: {
      key: action.payload.key,
      response: action.payload.response,
      timeAdded: action.payload.timeAdded,
      msToLive: action.payload.msToLive
    }
  });
}

/**
 * Remove a request from the cache
 *
 * @param state
 *    the current state
 * @param action
 *    an ResponseCacheRemoveAction
 * @return ResponseCacheState
 *    the new state, with the request removed if it existed.
 */
function removeFromCache(state: ResponseCacheState, action: ResponseCacheRemoveAction): ResponseCacheState {
  if (hasValue(state[action.payload])) {
    const newCache = Object.assign({}, state);
    delete newCache[action.payload];

    return newCache;
  } else {
    return state;
  }
}

/**
 * Set the timeAdded timestamp of every cached request to the specified value
 *
 * @param state
 *    the current state
 * @param action
 *    a ResetResponseCacheTimestampsAction
 * @return ResponseCacheState
 *    the new state, with all timeAdded timestamps set to the specified value
 */
function resetResponseCacheTimestamps(state: ResponseCacheState, action: ResetResponseCacheTimestampsAction): ResponseCacheState {
  const newState = Object.create(null);
  Object.keys(state).forEach((key) => {
    newState[key] = Object.assign({}, state[key], {
      timeAdded: action.payload
    });
  });
  return newState;
}
