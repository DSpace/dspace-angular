import * as tslib_1 from "tslib";
import { MenuSectionComponent } from './menu-section/menu-section.component';
import { MenuComponent } from './menu.component';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { LinkMenuItemComponent } from './menu-item/link-menu-item.component';
import { TextMenuItemComponent } from './menu-item/text-menu-item.component';
import { OnClickMenuItemComponent } from './menu-item/onclick-menu-item.component';
import { CommonModule } from '@angular/common';
var COMPONENTS = [
    MenuSectionComponent,
    MenuComponent,
    LinkMenuItemComponent,
    TextMenuItemComponent,
    OnClickMenuItemComponent
];
var ENTRY_COMPONENTS = [
    LinkMenuItemComponent,
    TextMenuItemComponent,
    OnClickMenuItemComponent
];
var MODULES = [
    TranslateModule,
    RouterModule,
    CommonModule
];
var PROVIDERS = [];
var MenuModule = /** @class */ (function () {
    /**
     * This module handles all components, providers and modules that are needed for the menu
     */
    function MenuModule() {
    }
    MenuModule = tslib_1.__decorate([
        NgModule({
            imports: MODULES.slice(),
            declarations: COMPONENTS.concat(ENTRY_COMPONENTS),
            providers: PROVIDERS.slice(),
            exports: COMPONENTS.concat(MODULES),
            entryComponents: ENTRY_COMPONENTS.slice()
        })
        /**
         * This module handles all components, providers and modules that are needed for the menu
         */
    ], MenuModule);
    return MenuModule;
}());
export { MenuModule };
//# sourceMappingURL=menu.module.js.map