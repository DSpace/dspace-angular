import { CSSVariableAction, CSSVariableActionTypes } from './sass-helper.actions';

export interface CSSVariablesState {
  [name: string]: string;
}

const initialState: CSSVariablesState = Object.create({});

export function cssVariablesReducer(state = initialState, action: CSSVariableAction): CSSVariablesState {
  switch (action.type) {
    case CSSVariableActionTypes.ADD: {
      const variable = action.payload;
      const t =  Object.assign({}, state, { [variable.name]: variable.value });
      return t;
    }
    default: {
      return state;
    }
  }
}
