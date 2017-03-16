import { PaginationOptions } from "../shared/pagination-options.model";
import { SortOptions } from "../shared/sort-options.model";
import {
  RequestCacheAction, RequestCacheActionTypes, RequestCacheFindAllAction,
  RequestCacheSuccessAction, RequestCacheErrorAction, RequestCacheFindByIDAction,
  RequestCacheRemoveAction, ResetRequestCacheTimestampsAction
} from "./request-cache.actions";
import { OpaqueToken } from "@angular/core";
import { CacheEntry } from "./cache-entry";
import { hasValue } from "../../shared/empty.util";

/**
 * An entry in the RequestCache
 */
export class RequestCacheEntry implements CacheEntry {
  service: OpaqueToken;
  key: string;
  scopeID: string;
  resourceID: string;
  resourceUUIDs: Array<String>;
  resourceType: String;
  isLoading: boolean;
  errorMessage: string;
  paginationOptions: PaginationOptions;
  sortOptions: SortOptions;
  timeAdded: number;
  msToLive: number;
}

/**
 * The RequestCache State
 */
export interface RequestCacheState {
  [key: string]: RequestCacheEntry
}

// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
const initialState = Object.create(null);

/**
 * The RequestCache Reducer
 *
 * @param state
 *    the current state
 * @param action
 *    the action to perform on the state
 * @return RequestCacheState
 *    the new state
 */
export const requestCacheReducer = (state = initialState, action: RequestCacheAction): RequestCacheState => {
  switch (action.type) {

    case RequestCacheActionTypes.FIND_ALL: {
      return findAllRequest(state, <RequestCacheFindAllAction> action);
    }

    case RequestCacheActionTypes.FIND_BY_ID: {
      return findByIDRequest(state, <RequestCacheFindByIDAction> action);
    }

    case RequestCacheActionTypes.SUCCESS: {
      return success(state, <RequestCacheSuccessAction> action);
    }

    case RequestCacheActionTypes.ERROR: {
      return error(state, <RequestCacheErrorAction> action);
    }

    case RequestCacheActionTypes.REMOVE: {
      return removeFromCache(state, <RequestCacheRemoveAction> action);
    }

    case RequestCacheActionTypes.RESET_TIMESTAMPS: {
      return resetRequestCacheTimestamps(state, <ResetRequestCacheTimestampsAction>action)
    }

    default: {
      return state;
    }
  }
};

/**
 * Add a FindAll request to the cache
 *
 * @param state
 *    the current state
 * @param action
 *    a RequestCacheFindAllAction
 * @return RequestCacheState
 *    the new state, with the request added, or overwritten
 */
function findAllRequest(state: RequestCacheState, action: RequestCacheFindAllAction): RequestCacheState {
  return Object.assign({}, state, {
    [action.payload.key]: {
      key: action.payload.key,
      service: action.payload.service,
      scopeID: action.payload.scopeID,
      resourceUUIDs: [],
      isLoading: true,
      errorMessage: undefined,
      paginationOptions: action.payload.paginationOptions,
      sortOptions: action.payload.sortOptions
    }
  });
}

/**
 * Add a FindByID request to the cache
 *
 * @param state
 *    the current state
 * @param action
 *    a RequestCacheFindByIDAction
 * @return RequestCacheState
 *    the new state, with the request added, or overwritten
 */
function findByIDRequest(state: RequestCacheState, action: RequestCacheFindByIDAction): RequestCacheState {
  return Object.assign({}, state, {
    [action.payload.key]: {
      key: action.payload.key,
      service: action.payload.service,
      resourceID: action.payload.resourceID,
      resourceUUIDs: [],
      isLoading: true,
      errorMessage: undefined,
    }
  });
}

/**
 * Update a cached request with a successful response
 *
 * @param state
 *    the current state
 * @param action
 *    a RequestCacheSuccessAction
 * @return RequestCacheState
 *    the new state, with the response added to the request
 */
function success(state: RequestCacheState, action: RequestCacheSuccessAction): RequestCacheState {
  return Object.assign({}, state, {
    [action.payload.key]: Object.assign({}, state[action.payload.key], {
      isLoading: false,
      resourceUUIDs: action.payload.resourceUUIDs,
      errorMessage: undefined,
      timeAdded: action.payload.timeAdded,
      msToLive: action.payload.msToLive
    })
  });
}

/**
 * Update a cached request with an error
 *
 * @param state
 *    the current state
 * @param action
 *    a RequestCacheSuccessAction
 * @return RequestCacheState
 *    the new state, with the error added to the request
 */
function error(state: RequestCacheState, action: RequestCacheErrorAction): RequestCacheState {
  return Object.assign({}, state, {
    [action.payload.key]: Object.assign({}, state[action.payload.key], {
      isLoading: false,
      errorMessage: action.payload.errorMessage
    })
  });
}

/**
 * Remove a request from the cache
 *
 * @param state
 *    the current state
 * @param action
 *    an RequestCacheRemoveAction
 * @return RequestCacheState
 *    the new state, with the request removed if it existed.
 */
function removeFromCache(state: RequestCacheState, action: RequestCacheRemoveAction): RequestCacheState {
  if (hasValue(state[action.payload])) {
    let newCache = Object.assign({}, state);
    delete newCache[action.payload];

    return newCache;
  }
  else {
    return state;
  }
}

/**
 * Set the timeAdded timestamp of every cached request to the specified value
 *
 * @param state
 *    the current state
 * @param action
 *    a ResetRequestCacheTimestampsAction
 * @return RequestCacheState
 *    the new state, with all timeAdded timestamps set to the specified value
 */
function resetRequestCacheTimestamps(state: RequestCacheState, action: ResetRequestCacheTimestampsAction): RequestCacheState {
  let newState = Object.create(null);
  Object.keys(state).forEach(key => {
    newState[key] = Object.assign({}, state[key], {
      timeAdded: action.payload
    });
  });
  return newState;
}
