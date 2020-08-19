import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { SubmissionSubmitComponent } from '../submission/submit/submission-submit.component';
import { UserAgreementGuard } from '../core/user-agreement/user-agreement.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [AuthenticatedGuard, UserAgreementGuard],
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
