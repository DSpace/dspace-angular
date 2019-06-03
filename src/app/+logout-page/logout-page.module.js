import * as tslib_1 from "tslib";
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LogoutPageComponent } from './logout-page.component';
import { LogoutPageRoutingModule } from './logout-page-routing.module';
var LogoutPageModule = /** @class */ (function () {
    function LogoutPageModule() {
    }
    LogoutPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                LogoutPageRoutingModule,
                CommonModule,
                SharedModule,
            ],
            declarations: [
                LogoutPageComponent
            ]
        })
    ], LogoutPageModule);
    return LogoutPageModule;
}());
export { LogoutPageModule };
//# sourceMappingURL=logout-page.module.js.map