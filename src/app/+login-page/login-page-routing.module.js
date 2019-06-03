import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page.component';
var LoginPageRoutingModule = /** @class */ (function () {
    function LoginPageRoutingModule() {
    }
    LoginPageRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                RouterModule.forChild([
                    { path: '', pathMatch: 'full', component: LoginPageComponent, data: { title: 'login.title' } }
                ])
            ]
        })
    ], LoginPageRoutingModule);
    return LoginPageRoutingModule;
}());
export { LoginPageRoutingModule };
//# sourceMappingURL=login-page-routing.module.js.map