import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { SubmissionSubmitComponent } from '../submission/submit/submission-submit.component';
var SubmitPageRoutingModule = /** @class */ (function () {
    /**
     * This module defines the default component to load when navigating to the submit page path.
     */
    function SubmitPageRoutingModule() {
    }
    SubmitPageRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                RouterModule.forChild([
                    {
                        canActivate: [AuthenticatedGuard],
                        path: '',
                        pathMatch: 'full',
                        component: SubmissionSubmitComponent,
                        data: { title: 'submission.submit.title' }
                    }
                ])
            ]
        })
        /**
         * This module defines the default component to load when navigating to the submit page path.
         */
    ], SubmitPageRoutingModule);
    return SubmitPageRoutingModule;
}());
export { SubmitPageRoutingModule };
//# sourceMappingURL=submit-page-routing.module.js.map