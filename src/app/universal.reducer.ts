import { UniversalAction, UniversalActionTypes } from './universal.actions';

export interface UniversalState {
  isReplaying: boolean;
}

const initialState: UniversalState = {
  isReplaying: false
};

export function universalReducer(state = initialState, action: UniversalAction): UniversalState {
  switch (action.type) {

    case UniversalActionTypes.REPLAY: {
      return Object.assign({}, state, {
        isReplaying: true
      });
    }

    case UniversalActionTypes.REPLAY_COMPLETE: {
      return Object.assign({}, state, {
        isReplaying: false
      });

    }

    default: {
      return state;
    }
  }
}
