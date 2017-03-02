import { PaginationOptions } from "../shared/pagination-options.model";
import { SortOptions } from "../shared/sort-options.model";
import {
  RequestCacheAction, RequestCacheActionTypes, RequestCacheFindAllAction,
  RequestCacheSuccessAction, RequestCacheErrorAction, RequestCacheFindByIDAction,
  RequestCacheRemoveAction
} from "./request-cache.actions";
import { OpaqueToken } from "@angular/core";
import { CacheEntry } from "./cache-entry";
import { hasValue } from "../../shared/empty.util";

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

export interface RequestCacheState {
  [key: string]: RequestCacheEntry
}

// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
const initialState = Object.create(null);

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

    default: {
      return state;
    }
  }
};

function findAllRequest(state: RequestCacheState, action: RequestCacheFindAllAction): RequestCacheState {
  console.log('break here', state);
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

function error(state: RequestCacheState, action: RequestCacheErrorAction): RequestCacheState {
  return Object.assign({}, state, {
    [action.payload.key]: Object.assign({}, state[action.payload.key], {
      isLoading: false,
      errorMessage: action.payload.errorMessage
    })
  });
}

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



