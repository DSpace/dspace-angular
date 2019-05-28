import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { SubmissionSubmitComponent } from '../submission/submit/submission-submit.component';

@NgModule({
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
export class SubmitPageRoutingModule { }
