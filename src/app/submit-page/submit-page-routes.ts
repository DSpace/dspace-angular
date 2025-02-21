import { Route } from '@angular/router';

import { authenticatedGuard } from '../../../modules/core/src/lib/core/auth/authenticated.guard';
import { i18nBreadcrumbResolver } from '../../../modules/core/src/lib/core/breadcrumbs/i18n-breadcrumb.resolver';
import { ThemedSubmissionSubmitComponent } from '../submission/submit/themed-submission-submit.component';

export const ROUTES: Route[] = [
  {
    canActivate: [authenticatedGuard],
    path: '',
    pathMatch: 'full',
    component: ThemedSubmissionSubmitComponent,
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    data: { title: 'submission.submit.title', breadcrumbKey: 'submission.submit' },
  },
];
