import { Route } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { i18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ThemedSubmissionSubmitComponent } from '../submission/submit/themed-submission-submit.component';

export const ROUTES: Route[] = [
  {
    canActivate: [AuthenticatedGuard],
    path: '',
    pathMatch: 'full',
    component: ThemedSubmissionSubmitComponent,
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    data: { title: 'submission.submit.title', breadcrumbKey: 'submission.submit' },
  },
];
