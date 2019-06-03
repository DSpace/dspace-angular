import { StoreActionTypes } from './store.actions';
// fallback ngrx debugger
var actionCounter = 0;
export function debugMetaReducer(reducer) {
    return function (state, action) {
        actionCounter++;
        console.log('@ngrx action', actionCounter, action.type);
        console.log('state', JSON.stringify(state));
        console.log('action', JSON.stringify(action));
        console.log('------------------------------------');
        return reducer(state, action);
    };
}
export function universalMetaReducer(reducer) {
    return function (state, action) {
        switch (action.type) {
            case StoreActionTypes.REHYDRATE:
                state = Object.assign({}, state, action.payload);
                break;
            case StoreActionTypes.REPLAY:
            default:
                break;
        }
        return reducer(state, action);
    };
}
export var debugMetaReducers = [
    debugMetaReducer
];
export var appMetaReducers = [
    universalMetaReducer
];
//# sourceMappingURL=app.metareducers.js.map