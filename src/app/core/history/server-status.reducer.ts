import { ServerStatusAction, ServerStatusActionTypes, UpdateServerStatusAction } from './server-status.actions';

/**
 * The auth state.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServerStatusState {
  isAvailable: boolean;
}

/**
 * The initial state.
 */
const initialState: ServerStatusState = {isAvailable: true};

export function serverStatusReducer(state = initialState, action: ServerStatusAction): ServerStatusState {
  switch (action.type) {
    case ServerStatusActionTypes.UPDATE_SERVER_STATUS: {
      return {isAvailable: (action as UpdateServerStatusAction).payload.isAvailable};
    }
    default: {
      return state;
    }
  }
}
