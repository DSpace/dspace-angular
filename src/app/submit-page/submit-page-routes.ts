import { Route } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ThemedSubmissionSubmitComponent } from '../submission/submit/themed-submission-submit.component';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';

export const ROUTES: Route[] = [
  {
    canActivate: [AuthenticatedGuard],
    path: '',
    pathMatch: 'full',
    component: ThemedSubmissionSubmitComponent,
    resolve: {
      breadcrumb: I18nBreadcrumbResolver
    },
    data: {title: 'submission.submit.title', breadcrumbKey: 'submission.submit'}
  }
];
