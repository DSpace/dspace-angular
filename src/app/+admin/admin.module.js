import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { AdminRegistriesModule } from './admin-registries/admin-registries.module';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
var AdminModule = /** @class */ (function () {
    function AdminModule() {
    }
    AdminModule = tslib_1.__decorate([
        NgModule({
            imports: [
                AdminRegistriesModule,
                AdminRoutingModule,
                SharedModule,
            ],
        })
    ], AdminModule);
    return AdminModule;
}());
export { AdminModule };
//# sourceMappingURL=admin.module.js.map