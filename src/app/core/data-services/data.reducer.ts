import { PaginationOptions } from "../shared/pagination-options.model";
import { SortOptions } from "../shared/sort-options.model";
import {
  DataAction, DataActionTypes, DataFindAllRequestAction,
  DataSuccessAction, DataErrorAction, DataFindByIDRequestAction
} from "./data.actions";
import { OpaqueToken } from "@angular/core";

export interface DataRequestState {
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

export interface DataState {
  [key: string]: DataRequestState
}

// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
const initialState = Object.create(null);

export const dataReducer = (state = initialState, action: DataAction): DataState => {
  switch (action.type) {

    case DataActionTypes.FIND_ALL_REQUEST: {
      return findAllRequest(state, <DataFindAllRequestAction> action);
    }

    case DataActionTypes.FIND_BY_ID_REQUEST: {
      return findByIDRequest(state, <DataFindByIDRequestAction> action);
    }

    case DataActionTypes.SUCCESS: {
      return success(state, <DataSuccessAction> action);
    }

    case DataActionTypes.ERROR: {
      return error(state, <DataErrorAction> action);
    }

    default: {
      return state;
    }
  }
};

function findAllRequest(state: DataState, action: DataFindAllRequestAction): DataState {
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

function findByIDRequest(state: DataState, action: DataFindByIDRequestAction): DataState {
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

function success(state: DataState, action: DataSuccessAction): DataState {
  return Object.assign({}, state, {
    [action.payload.key]: Object.assign({}, state[action.payload.key], {
      isLoading: false,
      resourceUUIDs: action.payload.resourceUUIDs,
      errorMessage: undefined
    })
  });
}

function error(state: DataState, action: DataErrorAction): DataState {
  return Object.assign({}, state, {
    [action.payload.key]: Object.assign({}, state[action.payload.key], {
      isLoading: false,
      errorMessage: action.payload.errorMessage
    })
  });
}


