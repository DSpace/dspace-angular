import { Action } from "@ngrx/store";
import { type } from "../shared/ngrx/type";

 /**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const HeaderActionTypes = {
  COLLAPSE: type('dspace/header/COLLAPSE'),
  EXPAND: type('dspace/header/EXPAND'),
  TOGGLE: type('dspace/header/TOGGLE')
};

export class HeaderCollapseAction implements Action {
  type = HeaderActionTypes.COLLAPSE;

  constructor() {}
}

export class HeaderExpandAction implements Action {
  type = HeaderActionTypes.EXPAND;

  constructor() {}
}

export class HeaderToggleAction implements Action {
  type = HeaderActionTypes.TOGGLE;

  constructor() {}
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type HeaderAction
  = HeaderCollapseAction
  | HeaderExpandAction
  | HeaderToggleAction
