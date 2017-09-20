import { CacheableObject } from '../cache/object-cache.reducer';
import {
  RequestActionTypes, RequestAction, RequestConfigureAction,
  RequestExecuteAction, RequestCompleteAction
} from './request.actions';
import { Request } from './request.models';

export class RequestEntry {
  request: Request<CacheableObject>;
  requestPending: boolean;
  responsePending: boolean;
  completed: boolean;
}

export interface RequestState {
  [key: string]: RequestEntry
}

// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
const initialState = Object.create(null);

export function requestReducer(state = initialState, action: RequestAction): RequestState {
  switch (action.type) {

    case RequestActionTypes.CONFIGURE: {
      return configureRequest(state, action as RequestConfigureAction);
    }

    case RequestActionTypes.EXECUTE: {
      return executeRequest(state, action as RequestExecuteAction);
    }

    case RequestActionTypes.COMPLETE: {
      return completeRequest(state, action as RequestCompleteAction);
    }

    default: {
      return state;
    }
  }
}

function configureRequest(state: RequestState, action: RequestConfigureAction): RequestState {
  return Object.assign({}, state, {
    [action.payload.href]: {
      request: action.payload,
      requestPending: true,
      responsePending: false,
      completed: false
    }
  });
}

function executeRequest(state: RequestState, action: RequestExecuteAction): RequestState {
  return Object.assign({}, state, {
    [action.payload]: Object.assign({}, state[action.payload], {
      requestPending: false,
      responsePending: true
    })
  });
}

/**
 * Update a request with the response
 *
 * @param state
 *    the current state
 * @param action
 *    a RequestCompleteAction
 * @return RequestState
 *    the new state, with the response added to the request
 */
function completeRequest(state: RequestState, action: RequestCompleteAction): RequestState {
  return Object.assign({}, state, {
    [action.payload]: Object.assign({}, state[action.payload], {
      responsePending: false,
      completed: true
    })
  });
}
