import { Action } from "@ngrx/store";
import { type } from "../shared/ngrx/type";

export const SpinnerActionTypes = {
    SHOW: type('dspace/spinner/SHOW'),
    HIDE: type('dspace/spinner/HIDE')
};

export class SpinnerShowAction implements Action {
    type = SpinnerActionTypes.SHOW;

    constructor() {}
}

export class SpinnerHideAction implements Action {
    type = SpinnerActionTypes.HIDE;

    constructor() {}
}

export type SpinnerAction
    = SpinnerShowAction
    | SpinnerHideAction