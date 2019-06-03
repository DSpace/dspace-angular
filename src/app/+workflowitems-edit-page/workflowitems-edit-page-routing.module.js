import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { SubmissionEditComponent } from '../submission/edit/submission-edit.component';
var WorkflowitemsEditPageRoutingModule = /** @class */ (function () {
    /**
     * This module defines the default component to load when navigating to the workflowitems edit page path.
     */
    function WorkflowitemsEditPageRoutingModule() {
    }
    WorkflowitemsEditPageRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                RouterModule.forChild([
                    { path: '', redirectTo: '/home', pathMatch: 'full' },
                    {
                        canActivate: [AuthenticatedGuard],
                        path: ':id/edit',
                        component: SubmissionEditComponent,
                        data: { title: 'submission.edit.title' }
                    }
                ])
            ]
        })
        /**
         * This module defines the default component to load when navigating to the workflowitems edit page path.
         */
    ], WorkflowitemsEditPageRoutingModule);
    return WorkflowitemsEditPageRoutingModule;
}());
export { WorkflowitemsEditPageRoutingModule };
//# sourceMappingURL=workflowitems-edit-page-routing.module.js.map