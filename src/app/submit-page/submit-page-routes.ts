import { Route } from '@angular/router';
import { authenticatedGuard, i18nBreadcrumbResolver } from '@dspace/core'

import {
  ThemedSubmissionSubmitComponent,
} from '../submission/submit/themed-submission-submit.component';

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
