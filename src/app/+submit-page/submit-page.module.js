import * as tslib_1 from "tslib";
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SubmitPageRoutingModule } from './submit-page-routing.module';
import { SubmissionModule } from '../submission/submission.module';
var SubmitPageModule = /** @class */ (function () {
    /**
     * This module handles all modules that need to access the submit page.
     */
    function SubmitPageModule() {
    }
    SubmitPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                SubmitPageRoutingModule,
                CommonModule,
                SharedModule,
                SubmissionModule,
            ],
        })
        /**
         * This module handles all modules that need to access the submit page.
         */
    ], SubmitPageModule);
    return SubmitPageModule;
}());
export { SubmitPageModule };
//# sourceMappingURL=submit-page.module.js.map