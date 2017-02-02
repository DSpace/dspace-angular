import { SpinnerAction, SpinnerActionTypes } from "./spinner.actions";

export interface SpinnerState {
    active:boolean;
}

const initialState:SpinnerState = {
    active: false
};

export const spinnerReducer = (state = initialState, action:SpinnerAction):SpinnerState => {
    switch (action.type) {

        case SpinnerActionTypes.SHOW:
        {
            return Object.assign({}, state, {
                active: true
            });
        }

        case SpinnerActionTypes.HIDE:
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
