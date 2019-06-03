import { CSSVariableActionTypes } from './sass-helper.actions';
var initialState = Object.create({});
export function cssVariablesReducer(state, action) {
    if (state === void 0) { state = initialState; }
    var _a;
    switch (action.type) {
        case CSSVariableActionTypes.ADD: {
            var variable = action.payload;
            var t = Object.assign({}, state, (_a = {}, _a[variable.name] = variable.value, _a));
            return t;
        }
        default: {
            return state;
        }
    }
}
//# sourceMappingURL=sass-helper.reducer.js.map