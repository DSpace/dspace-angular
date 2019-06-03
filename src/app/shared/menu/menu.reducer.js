import { MenuActionTypes } from './menu.actions';
import { initialMenusState } from './initial-menus-state';
import { hasValue } from '../empty.util';
/**
 * Represents the state of a single menu section in the store
 */
var MenuSection = /** @class */ (function () {
    function MenuSection() {
    }
    return MenuSection;
}());
export { MenuSection };
/**
 * Reducer that handles MenuActions to update the MenusState
 * @param {MenusState} state The initial MenusState
 * @param {MenuAction} action The Action to be performed on the state
 * @returns {MenusState} The new, reducer MenusState
 */
export function menusReducer(state, action) {
    if (state === void 0) { state = initialMenusState; }
    var _a, _b, _c, _d, _e, _f, _g;
    var menuState = state[action.menuID];
    switch (action.type) {
        case MenuActionTypes.COLLAPSE_MENU: {
            var newMenuState = Object.assign({}, menuState, { collapsed: true });
            return Object.assign({}, state, (_a = {}, _a[action.menuID] = newMenuState, _a));
        }
        case MenuActionTypes.EXPAND_MENU: {
            var newMenuState = Object.assign({}, menuState, { collapsed: false });
            return Object.assign({}, state, (_b = {}, _b[action.menuID] = newMenuState, _b));
        }
        case MenuActionTypes.COLLAPSE_MENU_PREVIEW: {
            var newMenuState = Object.assign({}, menuState, { previewCollapsed: true });
            return Object.assign({}, state, (_c = {}, _c[action.menuID] = newMenuState, _c));
        }
        case MenuActionTypes.EXPAND_MENU_PREVIEW: {
            var newMenuState = Object.assign({}, menuState, { previewCollapsed: false });
            return Object.assign({}, state, (_d = {}, _d[action.menuID] = newMenuState, _d));
        }
        case MenuActionTypes.TOGGLE_MENU: {
            var newMenuState = Object.assign({}, menuState, { collapsed: !menuState.collapsed });
            return Object.assign({}, state, (_e = {}, _e[action.menuID] = newMenuState, _e));
        }
        case MenuActionTypes.SHOW_MENU: {
            var newMenuState = Object.assign({}, menuState, { visible: true });
            return Object.assign({}, state, (_f = {}, _f[action.menuID] = newMenuState, _f));
        }
        case MenuActionTypes.HIDE_MENU: {
            var newMenuState = Object.assign({}, menuState, { visible: false });
            return Object.assign({}, state, (_g = {}, _g[action.menuID] = newMenuState, _g));
        }
        case MenuActionTypes.ADD_SECTION: {
            return addSection(state, action);
        }
        case MenuActionTypes.REMOVE_SECTION: {
            return removeSection(state, action);
        }
        case MenuActionTypes.ACTIVATE_SECTION: {
            return activateSection(state, action);
        }
        case MenuActionTypes.DEACTIVATE_SECTION: {
            return deactivateSection(state, action);
        }
        case MenuActionTypes.TOGGLE_ACTIVE_SECTION: {
            return toggleActiveSection(state, action);
        }
        case MenuActionTypes.HIDE_SECTION: {
            return hideSection(state, action);
        }
        case MenuActionTypes.SHOW_SECTION: {
            return showSection(state, action);
        }
        default: {
            return state;
        }
    }
}
/**
 * Add a section the a certain menu
 * @param {MenusState} state The initial state
 * @param {AddMenuSectionAction} action Action containing the new section and the menu's ID
 * @returns {MenusState} The new reduced state
 */
function addSection(state, action) {
    // let newState = addToIndex(state, action.section, action.menuID);
    var newState = putSectionState(state, action, action.section);
    return reorderSections(newState, action);
}
/**
 * Reorder all sections based on their index field
 * @param {MenusState} state The initial state
 * @param {MenuSectionAction} action Action containing the menu ID of the menu that is to be reordered
 * @returns {MenusState} The new reduced state
 */
function reorderSections(state, action) {
    var _a;
    var menuState = state[action.menuID];
    var newSectionState = {};
    var newSectionIndexState = {};
    Object.values(menuState.sections).sort(function (sectionA, sectionB) {
        var indexA = sectionA.index || 0;
        var indexB = sectionB.index || 0;
        return indexA - indexB;
    }).forEach(function (section) {
        newSectionState[section.id] = section;
        if (hasValue(section.parentID)) {
            var parentIndex = hasValue(newSectionIndexState[section.parentID]) ? newSectionIndexState[section.parentID] : [];
            newSectionIndexState[section.parentID] = parentIndex.concat([section.id]);
        }
    });
    var newMenuState = Object.assign({}, menuState, {
        sections: newSectionState,
        sectionToSubsectionIndex: newSectionIndexState
    });
    return Object.assign({}, state, (_a = {}, _a[action.menuID] = newMenuState, _a));
}
/**
 * Remove a section from a certain menu
 * @param {MenusState} state The initial state
 * @param {RemoveMenuSectionAction} action Action containing the section ID and menu ID of the section that should be removed
 * @returns {MenusState} The new reduced state
 */
function removeSection(state, action) {
    var _a;
    var menuState = state[action.menuID];
    var id = action.id;
    var newState = removeFromIndex(state, menuState.sections[action.id], action.menuID);
    var newMenuState = Object.assign({}, newState[action.menuID]);
    delete newMenuState.sections[id];
    return Object.assign({}, newState, (_a = {}, _a[action.menuID] = newMenuState, _a));
}
/**
 * Remove a section from the index of a certain menu
 * @param {MenusState} state The initial state
 * @param {MenuSection} action The MenuSection of which the ID should be removed from the index
 * @param {MenuID} action The Menu ID to which the section belonged
 * @returns {MenusState} The new reduced state
 */
function removeFromIndex(state, section, menuID) {
    var _a, _b;
    var sectionID = section.id;
    var parentID = section.parentID;
    if (hasValue(parentID)) {
        var menuState = state[menuID];
        var index = menuState.sectionToSubsectionIndex;
        var parentIndex = hasValue(index[parentID]) ? index[parentID] : [];
        var newIndex = Object.assign({}, index, (_a = {}, _a[parentID] = parentIndex.filter(function (id) { return id !== sectionID; }), _a));
        var newMenuState = Object.assign({}, menuState, { sectionToSubsectionIndex: newIndex });
        return Object.assign({}, state, (_b = {}, _b[menuID] = newMenuState, _b));
    }
    return state;
}
/**
 * Hide a certain section
 * @param {MenusState} state The initial state
 * @param {HideMenuSectionAction} action Action containing data to identify the section to be updated
 * @returns {MenusState} The new reduced state
 */
function hideSection(state, action) {
    return updateSectionState(state, action, { visible: false });
}
/**
 * Show a certain section
 * @param {MenusState} state The initial state
 * @param {ShowMenuSectionAction} action Action containing data to identify the section to be updated
 * @returns {MenusState} The new reduced state
 */
function showSection(state, action) {
    return updateSectionState(state, action, { visible: true });
}
/**
 * Deactivate a certain section
 * @param {MenusState} state The initial state
 * @param {DeactivateMenuSectionAction} action Action containing data to identify the section to be updated
 * @returns {MenusState} The new reduced state
 */
function deactivateSection(state, action) {
    var sectionState = state[action.menuID].sections[action.id];
    if (hasValue(sectionState)) {
        return updateSectionState(state, action, { active: false });
    }
}
/**
 * Activate a certain section
 * @param {MenusState} state The initial state
 * @param {DeactivateMenuSectionAction} action Action containing data to identify the section to be updated
 * @returns {MenusState} The new reduced state
 */
function activateSection(state, action) {
    var sectionState = state[action.menuID].sections[action.id];
    if (hasValue(sectionState)) {
        return updateSectionState(state, action, { active: true });
    }
}
/**
 * Deactivate a certain section when it's currently active, activate a certain section when it's currently inactive
 * @param {MenusState} state The initial state
 * @param {DeactivateMenuSectionAction} action Action containing data to identify the section to be updated
 * @returns {MenusState} The new reduced state
 */
function toggleActiveSection(state, action) {
    var sectionState = state[action.menuID].sections[action.id];
    if (hasValue(sectionState)) {
        return updateSectionState(state, action, { active: !sectionState.active });
    }
    return state;
}
/**
 * Add or replace a section in the state
 * @param {MenusState} state The initial state
 * @param {MenuAction} action The action which contains the menu ID of the menu of which the state is to be updated
 * @param {MenuSection} section The section that will be added or replaced in the state
 * @returns {MenusState} The new reduced state
 */
function putSectionState(state, action, section) {
    var _a, _b;
    var menuState = state[action.menuID];
    var newSections = Object.assign({}, menuState.sections, (_a = {},
        _a[section.id] = section,
        _a));
    var newMenuState = Object.assign({}, menuState, {
        sections: newSections
    });
    return Object.assign({}, state, (_b = {}, _b[action.menuID] = newMenuState, _b));
}
/**
 * Update a section
 * @param {MenusState} state The initial state
 * @param {MenuSectionAction} action The action containing the menu ID and section ID
 * @param {any} update A partial section that represents the part that should be updated in an existing section
 * @returns {MenusState} The new reduced state
 */
function updateSectionState(state, action, update) {
    var menuState = state[action.menuID];
    var sectionState = menuState.sections[action.id];
    if (hasValue(sectionState)) {
        var newTopSection = Object.assign({}, sectionState, update);
        return putSectionState(state, action, newTopSection);
    }
    return state;
}
//# sourceMappingURL=menu.reducer.js.map