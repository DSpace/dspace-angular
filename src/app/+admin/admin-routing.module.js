import * as tslib_1 from "tslib";
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
var AdminRoutingModule = /** @class */ (function () {
    function AdminRoutingModule() {
    }
    AdminRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                RouterModule.forChild([
                    {
                        path: 'registries',
                        loadChildren: './admin-registries/admin-registries.module#AdminRegistriesModule'
                    }
                ])
            ]
        })
    ], AdminRoutingModule);
    return AdminRoutingModule;
}());
export { AdminRoutingModule };
//# sourceMappingURL=admin-routing.module.js.map