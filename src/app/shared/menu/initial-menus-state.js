var _a;
/**
 * Availavle Menu IDs
 */
export var MenuID;
(function (MenuID) {
    MenuID["ADMIN"] = "admin-sidebar";
    MenuID["PUBLIC"] = "public";
})(MenuID || (MenuID = {}));
/**
 * List of possible MenuItemTypes
 */
export var MenuItemType;
(function (MenuItemType) {
    MenuItemType[MenuItemType["TEXT"] = 0] = "TEXT";
    MenuItemType[MenuItemType["LINK"] = 1] = "LINK";
    MenuItemType[MenuItemType["ALTMETRIC"] = 2] = "ALTMETRIC";
    MenuItemType[MenuItemType["SEARCH"] = 3] = "SEARCH";
    MenuItemType[MenuItemType["ONCLICK"] = 4] = "ONCLICK";
})(MenuItemType || (MenuItemType = {}));
/**
 * The initial state of the menus
 */
export var initialMenusState = (_a = {},
    _a[MenuID.ADMIN] = {
        id: MenuID.ADMIN,
        collapsed: true,
        previewCollapsed: true,
        visible: false,
        sections: {},
        sectionToSubsectionIndex: {}
    },
    _a[MenuID.PUBLIC] = {
        id: MenuID.PUBLIC,
        collapsed: true,
        previewCollapsed: true,
        visible: true,
        sections: {},
        sectionToSubsectionIndex: {}
    },
    _a);
//# sourceMappingURL=initial-menus-state.js.map