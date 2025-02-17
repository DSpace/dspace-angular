/* eslint-disable max-classes-per-file */
import {
  RequestAction,
  RequestActionTypes,
  RequestConfigureAction,
  RequestErrorAction,
  RequestExecuteAction,
  RequestRemoveAction,
  RequestStaleAction,
  RequestSuccessAction,
  ResetResponseTimestampsAction
} from './request.actions';
import { isNull } from '../../shared/empty.util';
import {
  hasSucceeded,
  isStale,
  RequestEntryState,
  isRequestPending,
  isResponsePending
} from './request-entry-state.model';
import { RequestState } from './request-state.model';

// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
const initialState = Object.create(null);

export function requestReducer(storeState = initialState, action: RequestAction): RequestState {
  switch (action.type) {

    case RequestActionTypes.CONFIGURE: {
      return configureRequest(storeState, action as RequestConfigureAction);
    }

    case RequestActionTypes.EXECUTE: {
      return executeRequest(storeState, action as RequestExecuteAction);
    }

    case RequestActionTypes.SUCCESS: {
      return completeSuccessRequest(storeState, action as RequestSuccessAction);
    }

    case RequestActionTypes.ERROR: {
      return completeFailedRequest(storeState, action as RequestErrorAction);
    }

    case RequestActionTypes.STALE: {
      return expireRequest(storeState, action as RequestStaleAction);
    }

    case RequestActionTypes.RESET_TIMESTAMPS: {
      return resetResponseTimestamps(storeState, action as ResetResponseTimestampsAction);
    }

    case RequestActionTypes.REMOVE: {
      return removeRequest(storeState, action as RequestRemoveAction);
    }

    default: {
      return storeState;
    }
  }
}

function configureRequest(storeState: RequestState, action: RequestConfigureAction): RequestState {
  return Object.assign({}, storeState, {
    [action.payload.uuid]: {
      request: action.payload,
      state: RequestEntryState.RequestPending,
      response: null,
      lastUpdated: action.lastUpdated
    }
  });
}

function executeRequest(storeState: RequestState, action: RequestExecuteAction): RequestState {
  if (isNull(storeState[action.payload])) {
    // after a request has been removed it's possible pending changes still come in.
    // Don't store them
    return storeState;
  } else {
    return Object.assign({}, storeState, {
      [action.payload]: Object.assign({}, storeState[action.payload], {
        state: RequestEntryState.ResponsePending,
        lastUpdated: action.lastUpdated
      })
    });
  }
}

/**
 * Update a request with that succeeded with the response
 *
 * @param storeState
 *    the current state of the store
 * @param action
 *    a RequestSuccessAction
 * @return RequestState
 *    the new storeState, with the response added to the request
 */
function completeSuccessRequest(storeState: RequestState, action: RequestSuccessAction): RequestState {
  const prevEntry = storeState[action.payload.uuid];
  if (isNull(prevEntry)) {
    // after a request has been removed it's possible pending changes still come in.
    // Don't store them
    return storeState;
  } else {
    return Object.assign({}, storeState, {
      [action.payload.uuid]: Object.assign({}, prevEntry, {
        // If a response comes in for a request that's already stale, still store it otherwise
        // components that are waiting for it might freeze
        state: isStale(prevEntry.state) ? RequestEntryState.SuccessStale : RequestEntryState.Success,
        response: {
          timeCompleted: action.payload.timeCompleted,
          lastUpdated: action.payload.timeCompleted,
          statusCode: action.payload.statusCode,
          payloadLink: action.payload.link,
          unCacheableObject: action.payload.unCacheableObject,
          errorMessage: null
        },
        lastUpdated: action.lastUpdated
      })
    });
  }
}

/**
 * Update a request with that failed with the response
 *
 * @param storeState
 *    the current state of the store
 * @param action
 *    a RequestSuccessAction
 * @return RequestState
 *    the new storeState, with the response added to the request
 */
function completeFailedRequest(storeState: RequestState, action: RequestErrorAction): RequestState {
  const prevEntry = storeState[action.payload.uuid];
  if (isNull(prevEntry)) {
    // after a request has been removed it's possible pending changes still come in.
    // Don't store them
    return storeState;
  } else {
    return Object.assign({}, storeState, {
      [action.payload.uuid]: Object.assign({}, prevEntry, {
        // If a response comes in for a request that's already stale, still store it otherwise
        // components that are waiting for it might freeze
        state: isStale(prevEntry.state) ? RequestEntryState.ErrorStale : RequestEntryState.Error,
        response: {
          timeCompleted: action.payload.timeCompleted,
          lastUpdated: action.payload.timeCompleted,
          statusCode: action.payload.statusCode,
          payloadLink: null,
          errorMessage: action.payload.errorMessage,
        },
        lastUpdated: action.lastUpdated
      })
    });
  }
}
/**
 * Set a request to stale
 *
 * @param storeState
 *    the current state of the store
 * @param action
 *    a RequestStaleAction
 * @return RequestState
 *    the new storeState, set to stale
 */
function expireRequest(storeState: RequestState, action: RequestStaleAction): RequestState {
  const prevEntry = storeState[action.payload.uuid];
  if (isNull(prevEntry) || isStale(prevEntry.state) || isRequestPending(prevEntry.state)) {
    // No need to do anything if the entry doesn't exist, is already stale, or if the request is
    // still pending, because that means it still needs to be sent to the server. Any response
    // is guaranteed to have been generated after the request was set to stale.
    return storeState;
  } else {
    let nextRequestEntryState: RequestEntryState;
    if (isResponsePending(prevEntry.state)) {
      nextRequestEntryState = RequestEntryState.ResponsePendingStale;
    } else if (hasSucceeded(prevEntry.state)) {
      nextRequestEntryState = RequestEntryState.SuccessStale;
    } else {
      nextRequestEntryState = RequestEntryState.ErrorStale;
    }
    return Object.assign({}, storeState, {
      [action.payload.uuid]: Object.assign({}, prevEntry, {
        state: nextRequestEntryState,
        lastUpdated: action.lastUpdated
      })
    });
  }
}

/**
 * Reset the timeCompleted property of all responses
 *
 * @param storeState
 *    the current state of the store
 * @param action
 *    a ResetResponseTimestampsAction
 * @return RequestState
 *    the new storeState, with the timeCompleted property reset
 */
function resetResponseTimestamps(storeState: RequestState, action: ResetResponseTimestampsAction): RequestState {
  const newState = Object.create(null);
  Object.keys(storeState).forEach((key) => {
    newState[key] = Object.assign({}, storeState[key],
      {
        response: Object.assign({}, storeState[key].response, {
          timeCompleted: action.payload
        }),
        lastUpdated: action.payload
      }
    );
  });
  return newState;
}

/**
 * Remove a request from the RequestState
 * @param storeState The current RequestState
 * @param action  The RequestRemoveAction to perform
 */
function removeRequest(storeState: RequestState, action: RequestRemoveAction): RequestState {
  const newState = Object.assign({}, storeState);
  newState[action.uuid] = null;
  return newState;
}
