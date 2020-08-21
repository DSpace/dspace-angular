import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { SubmissionEditComponent } from '../submission/edit/submission-edit.component';
import { EndUserAgreementGuard } from '../core/end-user-agreement/end-user-agreement.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      {
        canActivate: [AuthenticatedGuard, EndUserAgreementGuard],
        path: ':id/edit',
        component: SubmissionEditComponent,
        data: { title: 'submission.edit.title' }
      }
    ])
  ]
})
/**
 * This module defines the default component to load when navigating to the workspaceitems edit page path
 */
export class WorkspaceitemsEditPageRoutingModule { }
