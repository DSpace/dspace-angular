import { Route } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ThemedSubmissionImportExternalComponent } from '../submission/import-external/themed-submission-import-external.component';

export const ROUTES: Route[] = [
  {
    canActivate: [AuthenticatedGuard],
    path: '',
    component: ThemedSubmissionImportExternalComponent,
    pathMatch: 'full',
    data: {
      title: 'submission.import-external.page.title',
    },
  },
];

