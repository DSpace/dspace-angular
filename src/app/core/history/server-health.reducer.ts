import { ServerHealthAction, ServerHealthActionTypes, UpdateServerHealthAction } from './server-health.actions';

/**
 * The auth state.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServerHealthState {
  isOnline: boolean;
}

/**
 * The initial state.
 */
const initialState: ServerHealthState = {isOnline: true};

export function serverHealthReducer(state = initialState, action: ServerHealthAction): ServerHealthState {
  switch (action.type) {

    case ServerHealthActionTypes.UPDATE_SERVER_HEALTH: {
      return {isOnline: (action as UpdateServerHealthAction).payload.isOnline};
    }

    default: {
      return state;
    }
  }
}
