import { Action } from '@ngrx/store';
import { type } from '../ngrx/type';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const CSSVariableActionTypes = {
  ADD: type('dspace/css-variables/ADD'),
};

export class AddCSSVariableAction implements Action {
  type = CSSVariableActionTypes.ADD;
  payload: {
    name: string,
    value: string
  };

  constructor(name: string, value: string) {
    this.payload = {name, value};
  }
}

export type CSSVariableAction = AddCSSVariableAction;
