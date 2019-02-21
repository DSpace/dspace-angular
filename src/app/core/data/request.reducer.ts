import {
  RequestActionTypes, RequestAction, RequestConfigureAction,
  RequestExecuteAction, RequestCompleteAction, ResetResponseTimestampsAction, RequestRemoveAction
} from './request.actions';
import { RestRequest } from './request.models';
import { RestResponse } from '../cache/response.models';

export class RequestEntry {
  request: RestRequest;
  requestPending: boolean;
  responsePending: boolean;
  completed: boolean;
  response: RestResponse
}

export interface RequestState {
  [uuid: string]: RequestEntry
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
    case RequestActionTypes.RESET_TIMESTAMPS: {
      return resetResponseTimestamps(state, action as ResetResponseTimestampsAction);
    }

    case RequestActionTypes.REMOVE: {
      return removeRequest(state, action as RequestRemoveAction);
    }

    default: {
      return state;
    }
  }
}

function configureRequest(state: RequestState, action: RequestConfigureAction): RequestState {
  return Object.assign({}, state, {
    [action.payload.uuid]: {
      request: action.payload,
      requestPending: true,
      responsePending: false,
      completed: false,
    }
  });
}

function executeRequest(state: RequestState, action: RequestExecuteAction): RequestState {
  const obs = Object.assign({}, state, {
    [action.payload]: Object.assign({}, state[action.payload], {
      requestPending: false,
      responsePending: true
    })
  });
  return obs;
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
  const time = new Date().getTime();
  return Object.assign({}, state, {
    [action.payload.uuid]: Object.assign({}, state[action.payload.uuid], {
      responsePending: false,
      completed: true,
      response: Object.assign({}, action.payload.response, { timeAdded: time })
    })
  });
}

/**
 * Reset the timeAdded property of all responses
 *
 * @param state
 *    the current state
 * @param action
 *    a RequestCompleteAction
 * @return RequestState
 *    the new state, with the timeAdded property reset
 */
function resetResponseTimestamps(state: RequestState, action: ResetResponseTimestampsAction): RequestState {
  const newState = Object.create(null);
  Object.keys(state).forEach((key) => {
    newState[key] = Object.assign({}, state[key],
      { response: Object.assign({}, state[key].response, { timeAdded: action.payload }) }
    );
  });
  return newState;
}

/**
 * Remove a request from the RequestState
 * @param state   The current RequestState
 * @param action  The RequestRemoveAction to perform
 */
function removeRequest(state: RequestState, action: RequestRemoveAction): RequestState {
  const newState = Object.create(null);
  for (const value in state) {
    if (value !== action.uuid) {
      newState[value] = state[value];
    }
  }
  return newState;
}
