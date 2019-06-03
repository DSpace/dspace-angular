import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MyDSpacePageComponent } from './my-dspace-page.component';
import { MyDSpaceGuard } from './my-dspace.guard';
var MyDspacePageRoutingModule = /** @class */ (function () {
    /**
     * This module defines the default component to load when navigating to the mydspace page path.
     */
    function MyDspacePageRoutingModule() {
    }
    MyDspacePageRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                RouterModule.forChild([
                    {
                        path: '',
                        component: MyDSpacePageComponent,
                        data: { title: 'mydspace.title' },
                        canActivate: [
                            MyDSpaceGuard
                        ]
                    }
                ])
            ]
        })
        /**
         * This module defines the default component to load when navigating to the mydspace page path.
         */
    ], MyDspacePageRoutingModule);
    return MyDspacePageRoutingModule;
}());
export { MyDspacePageRoutingModule };
//# sourceMappingURL=my-dspace-page-routing.module.js.map