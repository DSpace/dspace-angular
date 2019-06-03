import { HistoryActionTypes } from './history.actions';
/**
 * The initial state.
 */
var initialState = [];
export function historyReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case HistoryActionTypes.ADD_TO_HISTORY: {
            return state.concat([action.payload.url]);
        }
        default: {
            return state;
        }
    }
}
//# sourceMappingURL=history.reducer.js.map