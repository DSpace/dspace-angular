import * as tslib_1 from "tslib";
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { WorkspaceitemsEditPageRoutingModule } from './workspaceitems-edit-page-routing.module';
import { SubmissionModule } from '../submission/submission.module';
var WorkspaceitemsEditPageModule = /** @class */ (function () {
    /**
     * This module handles all modules that need to access the workspaceitems edit page.
     */
    function WorkspaceitemsEditPageModule() {
    }
    WorkspaceitemsEditPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                WorkspaceitemsEditPageRoutingModule,
                CommonModule,
                SharedModule,
                SubmissionModule,
            ],
            declarations: []
        })
        /**
         * This module handles all modules that need to access the workspaceitems edit page.
         */
    ], WorkspaceitemsEditPageModule);
    return WorkspaceitemsEditPageModule;
}());
export { WorkspaceitemsEditPageModule };
//# sourceMappingURL=workspaceitems-edit-page.module.js.map