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
export var MenuActionTypes = {
    COLLAPSE_MENU: type('dspace/menu/COLLAPSE_MENU'),
    TOGGLE_MENU: type('dspace/menu/TOGGLE_MENU'),
    EXPAND_MENU: type('dspace/menu/EXPAND_MENU'),
    SHOW_MENU: type('dspace/menu/SHOW_MENU'),
    HIDE_MENU: type('dspace/menu/HIDE_MENU'),
    COLLAPSE_MENU_PREVIEW: type('dspace/menu/COLLAPSE_MENU_PREVIEW'),
    EXPAND_MENU_PREVIEW: type('dspace/menu/EXPAND_MENU_PREVIEW'),
    ADD_SECTION: type('dspace/menu-section/ADD_SECTION'),
    REMOVE_SECTION: type('dspace/menu-section/REMOVE_SECTION'),
    SHOW_SECTION: type('dspace/menu-section/SHOW_SECTION'),
    HIDE_SECTION: type('dspace/menu-section/HIDE_SECTION'),
    ACTIVATE_SECTION: type('dspace/menu-section/ACTIVATE_SECTION'),
    DEACTIVATE_SECTION: type('dspace/menu-section/DEACTIVATE_SECTION'),
    TOGGLE_ACTIVE_SECTION: type('dspace/menu-section/TOGGLE_ACTIVE_SECTION'),
};
/* tslint:disable:max-classes-per-file */
// MENU STATE ACTIONS
/**
 * Action used to collapse a single menu
 */
var CollapseMenuAction = /** @class */ (function () {
    function CollapseMenuAction(menuID) {
        this.type = MenuActionTypes.COLLAPSE_MENU;
        this.menuID = menuID;
    }
    return CollapseMenuAction;
}());
export { CollapseMenuAction };
/**
 * Action used to expand a single menu
 */
var ExpandMenuAction = /** @class */ (function () {
    function ExpandMenuAction(menuID) {
        this.type = MenuActionTypes.EXPAND_MENU;
        this.menuID = menuID;
    }
    return ExpandMenuAction;
}());
export { ExpandMenuAction };
/**
 * Action used to collapse a single menu when it's expanded and expanded it when it's collapse
 */
var ToggleMenuAction = /** @class */ (function () {
    function ToggleMenuAction(menuID) {
        this.type = MenuActionTypes.TOGGLE_MENU;
        this.menuID = menuID;
    }
    return ToggleMenuAction;
}());
export { ToggleMenuAction };
/**
 * Action used to show a single menu
 */
var ShowMenuAction = /** @class */ (function () {
    function ShowMenuAction(menuID) {
        this.type = MenuActionTypes.SHOW_MENU;
        this.menuID = menuID;
    }
    return ShowMenuAction;
}());
export { ShowMenuAction };
/**
 * Action used to hide a single menu
 */
var HideMenuAction = /** @class */ (function () {
    function HideMenuAction(menuID) {
        this.type = MenuActionTypes.HIDE_MENU;
        this.menuID = menuID;
    }
    return HideMenuAction;
}());
export { HideMenuAction };
/**
 * Action used to collapse a single menu's preview
 */
var CollapseMenuPreviewAction = /** @class */ (function () {
    function CollapseMenuPreviewAction(menuID) {
        this.type = MenuActionTypes.COLLAPSE_MENU_PREVIEW;
        this.menuID = menuID;
    }
    return CollapseMenuPreviewAction;
}());
export { CollapseMenuPreviewAction };
/**
 * Action used to expand a single menu's preview
 */
var ExpandMenuPreviewAction = /** @class */ (function () {
    function ExpandMenuPreviewAction(menuID) {
        this.type = MenuActionTypes.EXPAND_MENU_PREVIEW;
        this.menuID = menuID;
    }
    return ExpandMenuPreviewAction;
}());
export { ExpandMenuPreviewAction };
// MENU SECTION ACTIONS
/**
 * Action used to perform state changes for a section of a certain menu
 */
var MenuSectionAction = /** @class */ (function () {
    function MenuSectionAction(menuID, id) {
        this.menuID = menuID;
        this.id = id;
    }
    return MenuSectionAction;
}());
export { MenuSectionAction };
/**
 * Action used to add a section to a certain menu
 */
var AddMenuSectionAction = /** @class */ (function (_super) {
    tslib_1.__extends(AddMenuSectionAction, _super);
    function AddMenuSectionAction(menuID, section) {
        var _this = _super.call(this, menuID, section.id) || this;
        _this.type = MenuActionTypes.ADD_SECTION;
        _this.section = section;
        return _this;
    }
    return AddMenuSectionAction;
}(MenuSectionAction));
export { AddMenuSectionAction };
/**
 * Action used to remove a section from a certain menu
 */
var RemoveMenuSectionAction = /** @class */ (function (_super) {
    tslib_1.__extends(RemoveMenuSectionAction, _super);
    function RemoveMenuSectionAction(menuID, id) {
        var _this = _super.call(this, menuID, id) || this;
        _this.type = MenuActionTypes.REMOVE_SECTION;
        return _this;
    }
    return RemoveMenuSectionAction;
}(MenuSectionAction));
export { RemoveMenuSectionAction };
/**
 * Action used to hide a section of a certain menu
 */
var HideMenuSectionAction = /** @class */ (function (_super) {
    tslib_1.__extends(HideMenuSectionAction, _super);
    function HideMenuSectionAction(menuID, id) {
        var _this = _super.call(this, menuID, id) || this;
        _this.type = MenuActionTypes.HIDE_SECTION;
        return _this;
    }
    return HideMenuSectionAction;
}(MenuSectionAction));
export { HideMenuSectionAction };
/**
 * Action used to show a section of a certain menu
 */
var ShowMenuSectionAction = /** @class */ (function (_super) {
    tslib_1.__extends(ShowMenuSectionAction, _super);
    function ShowMenuSectionAction(menuID, id) {
        var _this = _super.call(this, menuID, id) || this;
        _this.type = MenuActionTypes.SHOW_SECTION;
        return _this;
    }
    return ShowMenuSectionAction;
}(MenuSectionAction));
export { ShowMenuSectionAction };
/**
 * Action used to make a section of a certain menu active
 */
var ActivateMenuSectionAction = /** @class */ (function (_super) {
    tslib_1.__extends(ActivateMenuSectionAction, _super);
    function ActivateMenuSectionAction(menuID, id) {
        var _this = _super.call(this, menuID, id) || this;
        _this.type = MenuActionTypes.ACTIVATE_SECTION;
        return _this;
    }
    return ActivateMenuSectionAction;
}(MenuSectionAction));
export { ActivateMenuSectionAction };
/**
 * Action used to make a section of a certain menu inactive
 */
var DeactivateMenuSectionAction = /** @class */ (function (_super) {
    tslib_1.__extends(DeactivateMenuSectionAction, _super);
    function DeactivateMenuSectionAction(menuID, id) {
        var _this = _super.call(this, menuID, id) || this;
        _this.type = MenuActionTypes.DEACTIVATE_SECTION;
        return _this;
    }
    return DeactivateMenuSectionAction;
}(MenuSectionAction));
export { DeactivateMenuSectionAction };
/**
 * Action used to make an active section of a certain menu inactive or an inactive section of a certain menu active
 */
var ToggleActiveMenuSectionAction = /** @class */ (function (_super) {
    tslib_1.__extends(ToggleActiveMenuSectionAction, _super);
    function ToggleActiveMenuSectionAction(menuID, id) {
        var _this = _super.call(this, menuID, id) || this;
        _this.type = MenuActionTypes.TOGGLE_ACTIVE_SECTION;
        return _this;
    }
    return ToggleActiveMenuSectionAction;
}(MenuSectionAction));
export { ToggleActiveMenuSectionAction };
/* tslint:enable:max-classes-per-file */
//# sourceMappingURL=menu.actions.js.map