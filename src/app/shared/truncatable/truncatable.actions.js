import * as tslib_1 from "tslib";
import { type } from '../ngrx/type';
/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export var TruncatableActionTypes = {
    TOGGLE: type('dspace/truncatable/TOGGLE'),
    COLLAPSE: type('dspace/truncatable/COLLAPSE'),
    EXPAND: type('dspace/truncatable/EXPAND'),
};
var TruncatableAction = /** @class */ (function () {
    /**
     * Initialize with the truncatable component's UUID
     * @param {string} id of the filter
     */
    function TruncatableAction(id) {
        this.id = id;
    }
    return TruncatableAction;
}());
export { TruncatableAction };
/* tslint:disable:max-classes-per-file */
/**
 * Used to collapse a truncatable component when it's expanded and expand it when it's collapsed
 */
var TruncatableToggleAction = /** @class */ (function (_super) {
    tslib_1.__extends(TruncatableToggleAction, _super);
    function TruncatableToggleAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = TruncatableActionTypes.TOGGLE;
        return _this;
    }
    return TruncatableToggleAction;
}(TruncatableAction));
export { TruncatableToggleAction };
/**
 * Used to collapse a truncatable component
 */
var TruncatableCollapseAction = /** @class */ (function (_super) {
    tslib_1.__extends(TruncatableCollapseAction, _super);
    function TruncatableCollapseAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = TruncatableActionTypes.COLLAPSE;
        return _this;
    }
    return TruncatableCollapseAction;
}(TruncatableAction));
export { TruncatableCollapseAction };
/**
 * Used to expand a truncatable component
 */
var TruncatableExpandAction = /** @class */ (function (_super) {
    tslib_1.__extends(TruncatableExpandAction, _super);
    function TruncatableExpandAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = TruncatableActionTypes.EXPAND;
        return _this;
    }
    return TruncatableExpandAction;
}(TruncatableAction));
export { TruncatableExpandAction };
/* tslint:enable:max-classes-per-file */
//# sourceMappingURL=truncatable.actions.js.map