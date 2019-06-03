import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { keySelector } from '../../app.reducer';
import { map, switchMap } from 'rxjs/operators';
import { ActivateMenuSectionAction, AddMenuSectionAction, CollapseMenuAction, CollapseMenuPreviewAction, DeactivateMenuSectionAction, ExpandMenuAction, ExpandMenuPreviewAction, HideMenuAction, RemoveMenuSectionAction, ShowMenuAction, ToggleActiveMenuSectionAction, ToggleMenuAction, } from './menu.actions';
import { hasNoValue, isNotEmpty } from '../empty.util';
import { combineLatest as observableCombineLatest } from 'rxjs';
var menusStateSelector = function (state) { return state.menus; };
var menuByIDSelector = function (menuID) {
    return keySelector(menuID, menusStateSelector);
};
var menuSectionStateSelector = function (state) { return state.sections; };
var menuSectionByIDSelector = function (id) {
    return keySelector(id, menuSectionStateSelector);
};
var menuSectionIndexStateSelector = function (state) { return state.sectionToSubsectionIndex; };
var getSubSectionsFromSectionSelector = function (id) {
    return keySelector(id, menuSectionIndexStateSelector);
};
var MenuService = /** @class */ (function () {
    function MenuService(store) {
        this.store = store;
    }
    /**
     * Retrieve a menu's state by its ID
     * @param {MenuID} id ID of the requested Menu
     * @returns {Observable<MenuState>} Observable that emits the current state of the requested Menu
     */
    MenuService.prototype.getMenu = function (id) {
        return this.store.pipe(select(menuByIDSelector(id)));
    };
    /**
     * Retrieve all top level sections of a certain menu
     * @param {MenuID} menuID ID of the Menu
     * @param {boolean} mustBeVisible True if you only want to request visible sections, false if you want to request all top level sections
     * @returns {Observable<MenuSection[]>} Observable that emits a list of MenuSections that are top sections of the given menu
     */
    MenuService.prototype.getMenuTopSections = function (menuID, mustBeVisible) {
        if (mustBeVisible === void 0) { mustBeVisible = true; }
        return this.store.pipe(select(menuByIDSelector(menuID)), select(menuSectionStateSelector), map(function (sections) {
            return Object.values(sections)
                .filter(function (section) { return hasNoValue(section.parentID); })
                .filter(function (section) { return !mustBeVisible || section.visible; });
        }));
    };
    /**
     * Retrieve all sub level sections of a certain top section in a given menu
     * @param {MenuID} menuID The ID of the menu
     * @param {string} parentID The ID of the parent section
     * @param {boolean} mustBeVisible True if you only want to request visible sections, false if you want to request all sections
     * @returns {Observable<MenuSection[]>} Observable that emits a list of MenuSections that are sub sections of the given menu and parent section
     */
    MenuService.prototype.getSubSectionsByParentID = function (menuID, parentID, mustBeVisible) {
        var _this = this;
        if (mustBeVisible === void 0) { mustBeVisible = true; }
        return this.store.pipe(select(menuByIDSelector(menuID)), select(getSubSectionsFromSectionSelector(parentID)), map(function (ids) { return isNotEmpty(ids) ? ids : []; }), switchMap(function (ids) {
            return observableCombineLatest(ids.map(function (id) { return _this.getMenuSection(menuID, id); }));
        }), map(function (sections) { return sections.filter(function (section) { return !mustBeVisible || section.visible; }); }));
    };
    /**
     * Check if the a menu's top level section has subsections
     * @param {MenuID} menuID The ID of the Menu
     * @param {string} parentID The ID of the top level parent section
     * @returns {Observable<boolean>} Observable that emits true when the given parent section has sub sections, false if the given parent section does not have any sub sections
     */
    MenuService.prototype.hasSubSections = function (menuID, parentID) {
        return this.store.pipe(select(menuByIDSelector(menuID)), select(getSubSectionsFromSectionSelector(parentID)), map(function (ids) { return isNotEmpty(ids); }));
    };
    /**
     * Retrieve a specific menu section by its menu ID and section ID
     * @param {MenuID} menuID The ID of the menu the section resides in
     * @param {string} sectionId The ID of the requested section
     * @returns {Observable<MenuSection>} Observable that emits the found MenuSection
     */
    MenuService.prototype.getMenuSection = function (menuID, sectionId) {
        return this.store.pipe(select(menuByIDSelector(menuID)), select(menuSectionByIDSelector(sectionId)));
    };
    /**
     * Add a new section to the store
     * @param {MenuID} menuID The menu to which the new section is to be added
     * @param {MenuSection} section The section to be added
     */
    MenuService.prototype.addSection = function (menuID, section) {
        this.store.dispatch(new AddMenuSectionAction(menuID, section));
    };
    /**
     * Remove a section from the store
     * @param {MenuID} menuID The menu from which the section is to be removed
     * @param {string} sectionID The ID of the section that should be removed
     */
    MenuService.prototype.removeSection = function (menuID, sectionID) {
        this.store.dispatch(new RemoveMenuSectionAction(menuID, sectionID));
    };
    /**
     * Check if a given menu is collapsed
     * @param {MenuID} menuID The ID of the menu that is to be checked
     * @returns {Observable<boolean>} Emits true if the given menu is collapsed, emits falls when it's expanded
     */
    MenuService.prototype.isMenuCollapsed = function (menuID) {
        return this.getMenu(menuID).pipe(map(function (state) { return state.collapsed; }));
    };
    /**
     * Check if a given menu's preview is collapsed
     * @param {MenuID} menuID The ID of the menu that is to be checked
     * @returns {Observable<boolean>} Emits true if the given menu's preview is collapsed, emits falls when it's expanded
     */
    MenuService.prototype.isMenuPreviewCollapsed = function (menuID) {
        return this.getMenu(menuID).pipe(map(function (state) { return state.previewCollapsed; }));
    };
    /**
     * Check if a given menu is visible
     * @param {MenuID} menuID The ID of the menu that is to be checked
     * @returns {Observable<boolean>} Emits true if the given menu is visible, emits falls when it's hidden
     */
    MenuService.prototype.isMenuVisible = function (menuID) {
        return this.getMenu(menuID).pipe(map(function (state) { return state.visible; }));
    };
    /**
     * Expands a given menu
     * @param {MenuID} menuID The ID of the menu
     */
    MenuService.prototype.expandMenu = function (menuID) {
        this.store.dispatch(new ExpandMenuAction(menuID));
    };
    /**
     * Collapses a given menu
     * @param {MenuID} menuID The ID of the menu
     */
    MenuService.prototype.collapseMenu = function (menuID) {
        this.store.dispatch(new CollapseMenuAction(menuID));
    };
    /**
     * Expands a given menu's preview
     * @param {MenuID} menuID The ID of the menu
     */
    MenuService.prototype.expandMenuPreview = function (menuID) {
        this.store.dispatch(new ExpandMenuPreviewAction(menuID));
    };
    /**
     * Collapses a given menu's preview
     * @param {MenuID} menuID The ID of the menu
     */
    MenuService.prototype.collapseMenuPreview = function (menuID) {
        this.store.dispatch(new CollapseMenuPreviewAction(menuID));
    };
    /**
     * Collapse a given menu when it's currently expanded or expand it when it's currently collapsed
     * @param {MenuID} menuID The ID of the menu
     */
    MenuService.prototype.toggleMenu = function (menuID) {
        this.store.dispatch(new ToggleMenuAction(menuID));
    };
    /**
     * Show a given menu
     * @param {MenuID} menuID The ID of the menu
     */
    MenuService.prototype.showMenu = function (menuID) {
        this.store.dispatch(new ShowMenuAction(menuID));
    };
    /**
     * Hide a given menu
     * @param {MenuID} menuID The ID of the menu
     */
    MenuService.prototype.hideMenu = function (menuID) {
        this.store.dispatch(new HideMenuAction(menuID));
    };
    /**
     * Activate a given menu section when it's currently inactive or deactivate it when it's currently active
     * @param {MenuID} menuID The ID of the menu
     * @param {string} id The ID of the section
     */
    MenuService.prototype.toggleActiveSection = function (menuID, id) {
        this.store.dispatch(new ToggleActiveMenuSectionAction(menuID, id));
    };
    /**
     * Activate a given menu section
     * @param {MenuID} menuID The ID of the menu
     * @param {string} id The ID of the section
     */
    MenuService.prototype.activateSection = function (menuID, id) {
        this.store.dispatch(new ActivateMenuSectionAction(menuID, id));
    };
    /**
     * Deactivate a given menu section
     * @param {MenuID} menuID The ID of the menu
     * @param {string} id The ID of the section
     */
    MenuService.prototype.deactivateSection = function (menuID, id) {
        this.store.dispatch(new DeactivateMenuSectionAction(menuID, id));
    };
    /**
     * Check whether a given section is currently active or not
     * @param {MenuID} menuID The ID of the Menu the section resides in
     * @param {string} id The ID of the menu section to check
     * @returns {Observable<boolean>} Emits true when the given section is currently active, false when the given section is currently inactive
     */
    MenuService.prototype.isSectionActive = function (menuID, id) {
        return this.getMenuSection(menuID, id).pipe(map(function (section) { return section.active; }));
    };
    /**
     * Check whether a given section is currently visible or not
     * @param {MenuID} menuID The ID of the Menu the section resides in
     * @param {string} id The ID of the menu section to check
     * @returns {Observable<boolean>} Emits true when the given section is currently visible, false when the given section is currently hidden
     */
    MenuService.prototype.isSectionVisible = function (menuID, id) {
        return this.getMenuSection(menuID, id).pipe(map(function (section) { return section.visible; }));
    };
    MenuService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Store])
    ], MenuService);
    return MenuService;
}());
export { MenuService };
//# sourceMappingURL=menu.service.js.map