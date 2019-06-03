import * as tslib_1 from "tslib";
import { Component, Injector } from '@angular/core';
import { MenuService } from '../menu.service';
import { MenuSection } from '../menu.reducer';
import { getComponentForMenuItemType } from '../menu-item.decorator';
import { hasNoValue } from '../../empty.util';
import { distinctUntilChanged } from 'rxjs/operators';
/**
 * A basic implementation of a menu section's component
 */
var MenuSectionComponent = /** @class */ (function () {
    function MenuSectionComponent(section, menuService, injector) {
        this.section = section;
        this.menuService = menuService;
        this.injector = injector;
        /**
         * List of Injectors for each dynamically rendered menu item of this section
         */
        this.itemInjectors = new Map();
        /**
         * List of child Components for each dynamically rendered menu item of this section
         */
        this.itemComponents = new Map();
    }
    /**
     * Set initial values for instance variables
     */
    MenuSectionComponent.prototype.ngOnInit = function () {
        this.active = this.menuService.isSectionActive(this.menuID, this.section.id).pipe(distinctUntilChanged());
        this.initializeInjectorData();
    };
    /**
     * Activate this section if it's currently inactive, deactivate it when it's currently active
     * @param {Event} event The user event that triggered this method
     */
    MenuSectionComponent.prototype.toggleSection = function (event) {
        event.preventDefault();
        this.menuService.toggleActiveSection(this.menuID, this.section.id);
    };
    /**
     * Activate this section
     * @param {Event} event The user event that triggered this method
     */
    MenuSectionComponent.prototype.activateSection = function (event) {
        event.preventDefault();
        this.menuService.activateSection(this.menuID, this.section.id);
    };
    /**
     * Deactivate this section
     * @param {Event} event The user event that triggered this method
     */
    MenuSectionComponent.prototype.deactivateSection = function (event) {
        event.preventDefault();
        this.menuService.deactivateSection(this.menuID, this.section.id);
    };
    /**
     * Method for initializing all injectors and component constructors for the menu items in this section
     */
    MenuSectionComponent.prototype.initializeInjectorData = function () {
        var _this = this;
        this.itemInjectors.set(this.section.id, this.getItemModelInjector(this.section.model));
        this.itemComponents.set(this.section.id, this.getMenuItemComponent(this.section.model));
        this.subSections = this.menuService.getSubSectionsByParentID(this.menuID, this.section.id);
        this.subSections.subscribe(function (sections) {
            sections.forEach(function (section) {
                _this.itemInjectors.set(section.id, _this.getItemModelInjector(section.model));
                _this.itemComponents.set(section.id, _this.getMenuItemComponent(section.model));
            });
        });
    };
    /**
     * Retrieve the component for a given MenuItemModel object
     * @param {MenuItemModel} itemModel The given MenuItemModel
     * @returns {GenericConstructor} Emits the constructor of the Component that should be used to render this menu item model
     */
    MenuSectionComponent.prototype.getMenuItemComponent = function (itemModel) {
        if (hasNoValue(itemModel)) {
            itemModel = this.section.model;
        }
        var type = itemModel.type;
        return getComponentForMenuItemType(type);
    };
    /**
     * Retrieve the Injector for a given MenuItemModel object
     * @param {MenuItemModel} itemModel The given MenuItemModel
     * @returns {Injector} The Injector that injects the data for this menu item into the item's component
     */
    MenuSectionComponent.prototype.getItemModelInjector = function (itemModel) {
        if (hasNoValue(itemModel)) {
            itemModel = this.section.model;
        }
        return Injector.create({
            providers: [{ provide: 'itemModelProvider', useFactory: function () { return (itemModel); }, deps: [] }],
            parent: this.injector
        });
    };
    MenuSectionComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-menu-section',
            template: ''
        }),
        tslib_1.__metadata("design:paramtypes", [MenuSection, MenuService, Injector])
    ], MenuSectionComponent);
    return MenuSectionComponent;
}());
export { MenuSectionComponent };
//# sourceMappingURL=menu-section.component.js.map