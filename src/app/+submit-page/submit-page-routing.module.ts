import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { SubmissionSubmitComponent } from '../submission/submit/submission-submit.component';
import { EndUserAgreementGuard } from '../core/end-user-agreement/end-user-agreement.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [AuthenticatedGuard, EndUserAgreementGuard],
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
export class SubmitPageRoutingModule { }
