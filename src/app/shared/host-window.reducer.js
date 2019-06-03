import { HostWindowActionTypes } from './host-window.actions';
var initialState = {
    width: null,
    height: null
};
export function hostWindowReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case HostWindowActionTypes.RESIZE: {
            return Object.assign({}, state, action.payload);
        }
        default: {
            return state;
        }
    }
}
//# sourceMappingURL=host-window.reducer.js.map