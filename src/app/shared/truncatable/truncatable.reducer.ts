import { TruncatableAction, TruncatableActionTypes } from './truncatable.actions';

export interface TruncatableState {
  collapsed: boolean;
}

export interface TruncatablesState {
  [id: string]: TruncatableState
}

const initialState: TruncatablesState = Object.create(null);

export function truncatableReducer(state = initialState, action: TruncatableAction): TruncatablesState {

  switch (action.type) {

    case TruncatableActionTypes.TOGGLE: {
      if (!state[action.id]) {
        state[action.id] = {collapsed: false};
      }
      return Object.assign({}, state, {
        [action.id]: {
          collapsed: !state[action.id].collapsed,
        }
      });
    }
    default: {
      return state;
    }
  }
}
