import * as tslib_1 from "tslib";
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { WorkflowitemsEditPageRoutingModule } from './workflowitems-edit-page-routing.module';
import { SubmissionModule } from '../submission/submission.module';
var WorkflowitemsEditPageModule = /** @class */ (function () {
    /**
     * This module handles all modules that need to access the workflowitems edit page.
     */
    function WorkflowitemsEditPageModule() {
    }
    WorkflowitemsEditPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                WorkflowitemsEditPageRoutingModule,
                CommonModule,
                SharedModule,
                SubmissionModule,
            ],
            declarations: []
        })
        /**
         * This module handles all modules that need to access the workflowitems edit page.
         */
    ], WorkflowitemsEditPageModule);
    return WorkflowitemsEditPageModule;
}());
export { WorkflowitemsEditPageModule };
//# sourceMappingURL=workflowitems-edit-page.module.js.map