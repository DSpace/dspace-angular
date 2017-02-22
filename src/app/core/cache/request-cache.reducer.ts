import { PaginationOptions } from "../shared/pagination-options.model";
import { SortOptions } from "../shared/sort-options.model";
import {
  RequestCacheAction, RequestCacheActionTypes, FindAllRequestCacheAction,
  RequestCacheSuccessAction, RequestCacheErrorAction, FindByIDRequestCacheAction
} from "./request-cache.actions";
import { OpaqueToken } from "@angular/core";

export interface CachedRequest {
  service: OpaqueToken
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
  [key: string]: CachedRequest
}

// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
const initialState = Object.create(null);

export const requestCacheReducer = (state = initialState, action: RequestCacheAction): RequestCacheState => {
  switch (action.type) {

    case RequestCacheActionTypes.FIND_ALL_REQUEST: {
      return findAllRequest(state, <FindAllRequestCacheAction> action);
    }

    case RequestCacheActionTypes.FIND_BY_ID_REQUEST: {
      return findByIDRequest(state, <FindByIDRequestCacheAction> action);
    }

    case RequestCacheActionTypes.SUCCESS: {
      return success(state, <RequestCacheSuccessAction> action);
    }

    case RequestCacheActionTypes.ERROR: {
      return error(state, <RequestCacheErrorAction> action);
    }

    default: {
      return state;
    }
  }
};

function findAllRequest(state: RequestCacheState, action: FindAllRequestCacheAction): RequestCacheState {
  return Object.assign({}, state, {
    [action.payload.key]: {
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

function findByIDRequest(state: RequestCacheState, action: FindByIDRequestCacheAction): RequestCacheState {
  return Object.assign({}, state, {
    [action.payload.key]: {
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
      timeAdded: new Date().getTime(),
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


