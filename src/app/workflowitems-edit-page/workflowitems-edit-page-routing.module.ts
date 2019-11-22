import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { SubmissionEditComponent } from '../submission/edit/submission-edit.component';

@NgModule({
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
export class WorkflowItemsEditPageRoutingModule { }
