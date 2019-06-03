import * as tslib_1 from "tslib";
import { type } from '../../../shared/ngrx/type';
/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export var SearchFilterActionTypes = {
    COLLAPSE: type('dspace/search-filter/COLLAPSE'),
    INITIALIZE: type('dspace/search-filter/INITIALIZE'),
    EXPAND: type('dspace/search-filter/EXPAND'),
    TOGGLE: type('dspace/search-filter/TOGGLE'),
    DECREMENT_PAGE: type('dspace/search-filter/DECREMENT_PAGE'),
    INCREMENT_PAGE: type('dspace/search-filter/INCREMENT_PAGE'),
    RESET_PAGE: type('dspace/search-filter/RESET_PAGE')
};
var SearchFilterAction = /** @class */ (function () {
    /**
     * Initialize with the filter's name
     * @param {string} name of the filter
     */
    function SearchFilterAction(name) {
        this.filterName = name;
    }
    return SearchFilterAction;
}());
export { SearchFilterAction };
/* tslint:disable:max-classes-per-file */
/**
 * Used to collapse a filter
 */
var SearchFilterCollapseAction = /** @class */ (function (_super) {
    tslib_1.__extends(SearchFilterCollapseAction, _super);
    function SearchFilterCollapseAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = SearchFilterActionTypes.COLLAPSE;
        return _this;
    }
    return SearchFilterCollapseAction;
}(SearchFilterAction));
export { SearchFilterCollapseAction };
/**
 * Used to expand a filter
 */
var SearchFilterExpandAction = /** @class */ (function (_super) {
    tslib_1.__extends(SearchFilterExpandAction, _super);
    function SearchFilterExpandAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = SearchFilterActionTypes.EXPAND;
        return _this;
    }
    return SearchFilterExpandAction;
}(SearchFilterAction));
export { SearchFilterExpandAction };
/**
 * Used to collapse a filter when it's expanded and expand it when it's collapsed
 */
var SearchFilterToggleAction = /** @class */ (function (_super) {
    tslib_1.__extends(SearchFilterToggleAction, _super);
    function SearchFilterToggleAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = SearchFilterActionTypes.TOGGLE;
        return _this;
    }
    return SearchFilterToggleAction;
}(SearchFilterAction));
export { SearchFilterToggleAction };
/**
 * Used to set the initial state of a filter
 */
var SearchFilterInitializeAction = /** @class */ (function (_super) {
    tslib_1.__extends(SearchFilterInitializeAction, _super);
    function SearchFilterInitializeAction(filter) {
        var _this = _super.call(this, filter.name) || this;
        _this.type = SearchFilterActionTypes.INITIALIZE;
        _this.initiallyExpanded = filter.isOpenByDefault;
        return _this;
    }
    return SearchFilterInitializeAction;
}(SearchFilterAction));
export { SearchFilterInitializeAction };
/**
 * Used to set the state of a filter to the previous page
 */
var SearchFilterDecrementPageAction = /** @class */ (function (_super) {
    tslib_1.__extends(SearchFilterDecrementPageAction, _super);
    function SearchFilterDecrementPageAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = SearchFilterActionTypes.DECREMENT_PAGE;
        return _this;
    }
    return SearchFilterDecrementPageAction;
}(SearchFilterAction));
export { SearchFilterDecrementPageAction };
/**
 * Used to set the state of a filter to the next page
 */
var SearchFilterIncrementPageAction = /** @class */ (function (_super) {
    tslib_1.__extends(SearchFilterIncrementPageAction, _super);
    function SearchFilterIncrementPageAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = SearchFilterActionTypes.INCREMENT_PAGE;
        return _this;
    }
    return SearchFilterIncrementPageAction;
}(SearchFilterAction));
export { SearchFilterIncrementPageAction };
/**
 * Used to set the state of a filter to the first page
 */
var SearchFilterResetPageAction = /** @class */ (function (_super) {
    tslib_1.__extends(SearchFilterResetPageAction, _super);
    function SearchFilterResetPageAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = SearchFilterActionTypes.RESET_PAGE;
        return _this;
    }
    return SearchFilterResetPageAction;
}(SearchFilterAction));
export { SearchFilterResetPageAction };
/* tslint:enable:max-classes-per-file */
//# sourceMappingURL=search-filter.actions.js.map