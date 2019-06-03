import * as tslib_1 from "tslib";
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { CoreModule } from '../core/core.module';
import { NavbarEffects } from './navbar.effects';
import { NavbarSectionComponent } from './navbar-section/navbar-section.component';
import { ExpandableNavbarSectionComponent } from './expandable-navbar-section/expandable-navbar-section.component';
import { NavbarComponent } from './navbar.component';
var effects = [
    NavbarEffects
];
var NavbarModule = /** @class */ (function () {
    /**
     * This module handles all components and pipes that are necessary for the horizontal navigation bar
     */
    function NavbarModule() {
    }
    NavbarModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                SharedModule,
                EffectsModule.forFeature(effects),
                CoreModule.forRoot()
            ],
            declarations: [
                NavbarComponent,
                NavbarSectionComponent,
                ExpandableNavbarSectionComponent
            ],
            providers: [],
            entryComponents: [
                NavbarSectionComponent,
                ExpandableNavbarSectionComponent
            ],
            exports: [
                NavbarComponent,
                NavbarSectionComponent,
                ExpandableNavbarSectionComponent
            ]
        })
        /**
         * This module handles all components and pipes that are necessary for the horizontal navigation bar
         */
    ], NavbarModule);
    return NavbarModule;
}());
export { NavbarModule };
//# sourceMappingURL=navbar.module.js.map