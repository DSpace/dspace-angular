import { hasNoValue, hasValue } from '../../shared/empty.util';
import { ServerSyncBufferActionTypes } from './server-sync-buffer.actions';
/**
 * An entry in the ServerSyncBufferState
 * href: unique href of an ObjectCacheEntry
 * method: RestRequestMethod type
 */
var ServerSyncBufferEntry = /** @class */ (function () {
    function ServerSyncBufferEntry() {
    }
    return ServerSyncBufferEntry;
}());
export { ServerSyncBufferEntry };
var initialState = { buffer: [] };
/**
 * The ServerSyncBuffer Reducer
 *
 * @param state
 *    the current state
 * @param action
 *    the action to perform on the state
 * @return ServerSyncBufferState
 *    the new state
 */
export function serverSyncBufferReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case ServerSyncBufferActionTypes.ADD: {
            return addToServerSyncQueue(state, action);
        }
        case ServerSyncBufferActionTypes.EMPTY: {
            return emptyServerSyncQueue(state, action);
        }
        default: {
            return state;
        }
    }
}
/**
 * Add a new entry to the buffer with a specified method
 *
 * @param state
 *    the current state
 * @param action
 *    an AddToSSBAction
 * @return ServerSyncBufferState
 *    the new state, with a new entry added to the buffer
 */
function addToServerSyncQueue(state, action) {
    var actionEntry = action.payload;
    if (hasNoValue(state.buffer.find(function (entry) { return entry.href === actionEntry.href && entry.method === actionEntry.method; }))) {
        return Object.assign({}, state, { buffer: state.buffer.concat(actionEntry) });
    }
}
/**
 * Remove all ServerSyncBuffers entry from the buffer with a specified method
 * If no method is specified, empty the whole buffer
 *
 * @param state
 *    the current state
 * @param action
 *    an AddToSSBAction
 * @return ServerSyncBufferState
 *    the new state, with a new entry added to the buffer
 */
function emptyServerSyncQueue(state, action) {
    var newBuffer = [];
    if (hasValue(action.payload)) {
        newBuffer = state.buffer.filter(function (entry) { return entry.method !== action.payload; });
    }
    return Object.assign({}, state, { buffer: newBuffer });
}
//# sourceMappingURL=server-sync-buffer.reducer.js.map