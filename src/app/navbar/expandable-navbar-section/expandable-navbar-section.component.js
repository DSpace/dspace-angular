import * as tslib_1 from "tslib";
import { Component, Inject, Injector } from '@angular/core';
import { NavbarSectionComponent } from '../navbar-section/navbar-section.component';
import { MenuService } from '../../shared/menu/menu.service';
import { MenuID } from '../../shared/menu/initial-menus-state';
import { slide } from '../../shared/animations/slide';
import { first } from 'rxjs/operators';
import { HostWindowService } from '../../shared/host-window.service';
import { rendersSectionForMenu } from '../../shared/menu/menu-section.decorator';
/**
 * Represents an expandable section in the navbar
 */
var ExpandableNavbarSectionComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ExpandableNavbarSectionComponent, _super);
    function ExpandableNavbarSectionComponent(menuSection, menuService, injector, windowService) {
        var _this = _super.call(this, menuSection, menuService, injector) || this;
        _this.menuService = menuService;
        _this.injector = injector;
        _this.windowService = windowService;
        /**
         * This section resides in the Public Navbar
         */
        _this.menuID = MenuID.PUBLIC;
        return _this;
    }
    ExpandableNavbarSectionComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
    };
    /**
     * Overrides the super function that activates this section (triggered on hover)
     * Has an extra check to make sure the section can only be activated on non-mobile devices
     * @param {Event} event The user event that triggered this function
     */
    ExpandableNavbarSectionComponent.prototype.activateSection = function (event) {
        var _this = this;
        this.windowService.isXsOrSm().pipe(first()).subscribe(function (isMobile) {
            if (!isMobile) {
                _super.prototype.activateSection.call(_this, event);
            }
        });
    };
    /**
     * Overrides the super function that deactivates this section (triggered on hover)
     * Has an extra check to make sure the section can only be deactivated on non-mobile devices
     * @param {Event} event The user event that triggered this function
     */
    ExpandableNavbarSectionComponent.prototype.deactivateSection = function (event) {
        var _this = this;
        this.windowService.isXsOrSm().pipe(first()).subscribe(function (isMobile) {
            if (!isMobile) {
                _super.prototype.deactivateSection.call(_this, event);
            }
        });
    };
    /**
     * Overrides the super function that toggles this section (triggered on click)
     * Has an extra check to make sure the section can only be toggled on mobile devices
     * @param {Event} event The user event that triggered this function
     */
    ExpandableNavbarSectionComponent.prototype.toggleSection = function (event) {
        var _this = this;
        event.preventDefault();
        this.windowService.isXsOrSm().pipe(first()).subscribe(function (isMobile) {
            if (isMobile) {
                _super.prototype.toggleSection.call(_this, event);
            }
        });
    };
    ExpandableNavbarSectionComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-expandable-navbar-section',
            templateUrl: './expandable-navbar-section.component.html',
            styleUrls: ['./expandable-navbar-section.component.scss'],
            animations: [slide]
        }),
        rendersSectionForMenu(MenuID.PUBLIC, true),
        tslib_1.__param(0, Inject('sectionDataProvider')),
        tslib_1.__metadata("design:paramtypes", [Object, MenuService,
            Injector,
            HostWindowService])
    ], ExpandableNavbarSectionComponent);
    return ExpandableNavbarSectionComponent;
}(NavbarSectionComponent));
export { ExpandableNavbarSectionComponent };
//# sourceMappingURL=expandable-navbar-section.component.js.map