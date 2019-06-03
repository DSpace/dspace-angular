import { type } from '../../shared/ngrx/type';
/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export var CSSVariableActionTypes = {
    ADD: type('dspace/css-variables/ADD'),
};
var AddCSSVariableAction = /** @class */ (function () {
    function AddCSSVariableAction(name, value) {
        this.type = CSSVariableActionTypes.ADD;
        this.payload = { name: name, value: value };
    }
    return AddCSSVariableAction;
}());
export { AddCSSVariableAction };
//# sourceMappingURL=sass-helper.actions.js.map