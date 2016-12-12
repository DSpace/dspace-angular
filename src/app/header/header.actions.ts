import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";

@Injectable()
export class HeaderActions {
  static COLLAPSE = 'dspace/header/COLLAPSE';
  collapse(): Action {
    return {
      type: HeaderActions.COLLAPSE
    }
  }

  static EXPAND = 'dspace/header/EXPAND';
  expand(): Action {
    return {
      type: HeaderActions.EXPAND
    }
  }

  static TOGGLE = 'dspace/header/TOGGLE';
  toggle(): Action {
    return {
      type: HeaderActions.TOGGLE
    }
  }
}
