import {Action} from "@ngrx/store";
import {SpinnerActions} from "./spinner.actions";

export interface SpinnerState {
    active:boolean;
}

const initialState:SpinnerState = {
    active: false
};

export const spinnerReducer = (state = initialState, action:Action):SpinnerState => {
    switch (action.type) {

        case SpinnerActions.SHOW:
        {
            return Object.assign({}, state, {
                active: true
            });
        }

        case SpinnerActions.HIDE:
        {
            return Object.assign({}, state, {
                active: false
            });

        }

        default:
        {
            return state;
        }
    }
};
