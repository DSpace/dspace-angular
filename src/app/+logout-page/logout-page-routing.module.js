import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoutPageComponent } from './logout-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
var LogoutPageRoutingModule = /** @class */ (function () {
    function LogoutPageRoutingModule() {
    }
    LogoutPageRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                RouterModule.forChild([
                    {
                        canActivate: [AuthenticatedGuard],
                        path: '',
                        component: LogoutPageComponent,
                        data: { title: 'logout.title' }
                    }
                ])
            ]
        })
    ], LogoutPageRoutingModule);
    return LogoutPageRoutingModule;
}());
export { LogoutPageRoutingModule };
//# sourceMappingURL=logout-page-routing.module.js.map