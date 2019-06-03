import * as tslib_1 from "tslib";
import { Component, Injector } from '@angular/core';
import { MenuService } from '../../shared/menu/menu.service';
import { first, map } from 'rxjs/operators';
import { hasValue } from '../empty.util';
import { getComponentForMenu } from './menu-section.decorator';
/**
 * A basic implementation of a MenuComponent
 */
var MenuComponent = /** @class */ (function () {
    function MenuComponent(menuService, injector) {
        this.menuService = menuService;
        this.injector = injector;
        /**
         * List of Injectors for each dynamically rendered menu section
         */
        this.sectionInjectors = new Map();
        /**
         * List of child Components for each dynamically rendered menu section
         */
        this.sectionComponents = new Map();
    }
    /**
     * Sets all instance variables to their initial values
     */
    MenuComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.menuCollapsed = this.menuService.isMenuCollapsed(this.menuID);
        this.menuPreviewCollapsed = this.menuService.isMenuPreviewCollapsed(this.menuID);
        this.menuVisible = this.menuService.isMenuVisible(this.menuID);
        this.sections = this.menuService.getMenuTopSections(this.menuID).pipe(first());
        this.sections.subscribe(function (sections) {
            sections.forEach(function (section) {
                _this.sectionInjectors.set(section.id, _this.getSectionDataInjector(section));
                _this.getSectionComponent(section).pipe(first()).subscribe(function (constr) { return _this.sectionComponents.set(section.id, constr); });
            });
        });
    };
    /**
     *  Collapse this menu when it's currently expanded, expand it when its currently collapsed
     * @param {Event} event The user event that triggered this method
     */
    MenuComponent.prototype.toggle = function (event) {
        event.preventDefault();
        this.menuService.toggleMenu(this.menuID);
    };
    /**
     * Expand this menu
     * @param {Event} event The user event that triggered this method
     */
    MenuComponent.prototype.expand = function (event) {
        event.preventDefault();
        this.menuService.expandMenu(this.menuID);
    };
    /**
     * Collapse this menu
     * @param {Event} event The user event that triggered this method
     */
    MenuComponent.prototype.collapse = function (event) {
        event.preventDefault();
        this.menuService.collapseMenu(this.menuID);
    };
    /**
     * Expand this menu's preview
     * @param {Event} event The user event that triggered this method
     */
    MenuComponent.prototype.expandPreview = function (event) {
        var _this = this;
        event.preventDefault();
        this.previewToggleDebounce(function () { return _this.menuService.expandMenuPreview(_this.menuID); }, 100);
    };
    /**
     * Collapse this menu's preview
     * @param {Event} event The user event that triggered this method
     */
    MenuComponent.prototype.collapsePreview = function (event) {
        var _this = this;
        event.preventDefault();
        this.previewToggleDebounce(function () { return _this.menuService.collapseMenuPreview(_this.menuID); }, 400);
    };
    /**
     * delay the handler function by the given amount of time
     *
     * @param {Function} handler The function to delay
     * @param {number} ms The amount of ms to delay the handler function by
     */
    MenuComponent.prototype.previewToggleDebounce = function (handler, ms) {
        if (hasValue(this.previewTimer)) {
            clearTimeout(this.previewTimer);
        }
        this.previewTimer = setTimeout(handler, ms);
    };
    /**
     * Retrieve the component for a given MenuSection object
     * @param {MenuSection} section The given MenuSection
     * @returns {Observable<GenericConstructor<MenuSectionComponent>>} Emits the constructor of the Component that should be used to render this object
     */
    MenuComponent.prototype.getSectionComponent = function (section) {
        var _this = this;
        return this.menuService.hasSubSections(this.menuID, section.id).pipe(map(function (expandable) {
            return getComponentForMenu(_this.menuID, expandable);
        }));
    };
    /**
     * Retrieve the Injector for a given MenuSection object
     * @param {MenuSection} section The given MenuSection
     * @returns {Injector} The Injector that injects the data for this menu section into the section's component
     */
    MenuComponent.prototype.getSectionDataInjector = function (section) {
        return Injector.create({
            providers: [{ provide: 'sectionDataProvider', useFactory: function () { return (section); }, deps: [] }],
            parent: this.injector
        });
    };
    MenuComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-menu',
            template: ''
        }),
        tslib_1.__metadata("design:paramtypes", [MenuService, Injector])
    ], MenuComponent);
    return MenuComponent;
}());
export { MenuComponent };
//# sourceMappingURL=menu.component.js.map