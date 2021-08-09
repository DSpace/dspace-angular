import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ThemedSubmissionEditComponent } from '../submission/edit/themed-submission-edit.component';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      {
        canActivate: [AuthenticatedGuard],
        path: ':id/edit',
        component: ThemedSubmissionEditComponent,
        resolve: {
          breadcrumb: I18nBreadcrumbResolver
        },
        data: { title: 'submission.edit.title', breadcrumbKey: 'submission.edit' }
      }
    ])
  ]
})
/**
 * This module defines the default component to load when navigating to the workspaceitems edit page path
 */
export class WorkspaceitemsEditPageRoutingModule { }
