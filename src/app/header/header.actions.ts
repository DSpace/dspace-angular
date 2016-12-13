import { Action } from "@ngrx/store";

export class HeaderActions {
  static COLLAPSE = 'dspace/header/COLLAPSE';
  static collapse(): Action {
    return {
      type: HeaderActions.COLLAPSE
    }
  }

  static EXPAND = 'dspace/header/EXPAND';
  static expand(): Action {
    return {
      type: HeaderActions.EXPAND
    }
  }

  static TOGGLE = 'dspace/header/TOGGLE';
  static toggle(): Action {
    return {
      type: HeaderActions.TOGGLE
    }
  }
}
