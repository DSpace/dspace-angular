import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { SubmissionSubmitComponent } from '../submission/submit/submission-submit.component';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [AuthenticatedGuard],
        path: '',
        pathMatch: 'full',
        component: SubmissionSubmitComponent,
        resolve: {
          breadcrumb: I18nBreadcrumbResolver
        },
        data: { title: 'submission.submit.title', breadcrumbKey: 'submission.submit' }
      }
    ])
  ]
})
/**
 * This module defines the default component to load when navigating to the submit page path.
 */
export class SubmitPageRoutingModule { }
