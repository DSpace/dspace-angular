import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page.component';
var HomePageRoutingModule = /** @class */ (function () {
    function HomePageRoutingModule() {
    }
    HomePageRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                RouterModule.forChild([
                    { path: '', component: HomePageComponent, pathMatch: 'full', data: { title: 'home.title' } }
                ])
            ]
        })
    ], HomePageRoutingModule);
    return HomePageRoutingModule;
}());
export { HomePageRoutingModule };
//# sourceMappingURL=home-page-routing.module.js.map