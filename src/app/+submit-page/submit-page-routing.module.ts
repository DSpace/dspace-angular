import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ThemedSubmissionSubmitComponent } from '../submission/submit/themed-submission-submit.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [AuthenticatedGuard],
        path: '',
        pathMatch: 'full',
        component: ThemedSubmissionSubmitComponent,
        data: { title: 'submission.submit.title' }
      }
    ])
  ]
})
/**
 * This module defines the default component to load when navigating to the submit page path.
 */
export class SubmitPageRoutingModule { }
