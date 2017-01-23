import * as deepFreeze from "deep-freeze";

import { spinnerReducer } from "./spinner.reducer";
import {
    SpinnerShowAction,
    SpinnerHideAction
} from "./spinner.actions";

class NullAction extends SpinnerHideAction {
    type = null;

    constructor() {
        super();
    }
}

describe("spinnerReducer", () => {
    it("should return the current state when no valid actions have been made", () => {
        const state = { active: false };
        const action = new NullAction();
        const newState = spinnerReducer(state, action);

        expect(newState).toEqual(state);
    });

    it("should start with active = false", () => {
        const action = new NullAction();
        const initialState = spinnerReducer(undefined, action);

        // The navigation starts collapsed
        expect(initialState.active).toEqual(false);
    });

    it("should set active to true in response to the SHOW action", () => {
        const state = { active: false };
        const action = new SpinnerShowAction();
        const newState = spinnerReducer(state, action);

        expect(newState.active).toEqual(true);
    });

    it("should perform the SHOW action without affecting the previous state", () => {
        const state = { active: false };
        deepFreeze(state);

        const action = new SpinnerShowAction();
        spinnerReducer(state, action);

        //no expect required, deepFreeze will ensure an exception is thrown if the state
        //is mutated, and any uncaught exception will cause the test to fail
    });

    it("should set active to false in response to the HIDE action", () => {
        const state = { active: true };
        const action = new SpinnerHideAction();
        const newState = spinnerReducer(state, action);

        expect(newState.active).toEqual(false);
    });

    it("should perform the HIDE action without affecting the previous state", () => {
        const state = { active: true };
        deepFreeze(state);

        const action = new SpinnerHideAction();
        spinnerReducer(state, action);
    });


});
