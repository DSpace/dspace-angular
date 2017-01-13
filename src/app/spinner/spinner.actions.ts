import { Action } from "@ngrx/store";

export class SpinnerActions {
    static SHOW = 'dspace/spinner/SHOW';
    static show(): Action {
        return {
            type: SpinnerActions.SHOW
        }
    }

    static HIDE = 'dspace/spinner/HIDE';
    static hide(): Action {
        return {
            type: SpinnerActions.HIDE
        }
    }

}
