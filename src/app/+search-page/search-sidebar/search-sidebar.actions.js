import { type } from '../../shared/ngrx/type';
/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export var SearchSidebarActionTypes = {
    COLLAPSE: type('dspace/search-sidebar/COLLAPSE'),
    EXPAND: type('dspace/search-sidebar/EXPAND'),
    TOGGLE: type('dspace/search-sidebar/TOGGLE')
};
/* tslint:disable:max-classes-per-file */
/**
 * Used to collapse the sidebar
 */
var SearchSidebarCollapseAction = /** @class */ (function () {
    function SearchSidebarCollapseAction() {
        this.type = SearchSidebarActionTypes.COLLAPSE;
    }
    return SearchSidebarCollapseAction;
}());
export { SearchSidebarCollapseAction };
/**
 * Used to expand the sidebar
 */
var SearchSidebarExpandAction = /** @class */ (function () {
    function SearchSidebarExpandAction() {
        this.type = SearchSidebarActionTypes.EXPAND;
    }
    return SearchSidebarExpandAction;
}());
export { SearchSidebarExpandAction };
/**
 * Used to collapse the sidebar when it's expanded and expand it when it's collapsed
 */
var SearchSidebarToggleAction = /** @class */ (function () {
    function SearchSidebarToggleAction() {
        this.type = SearchSidebarActionTypes.TOGGLE;
    }
    return SearchSidebarToggleAction;
}());
export { SearchSidebarToggleAction };
//# sourceMappingURL=search-sidebar.actions.js.map