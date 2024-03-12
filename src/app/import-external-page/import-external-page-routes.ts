import { Route } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ThemedSubmissionImportExternalComponent } from '../submission/import-external/themed-submission-import-external.component';
import { provideSubmission } from '../submission/provide-submission';

export const ROUTES: Route[] = [
  {
    canActivate: [AuthenticatedGuard],
    path: '',
    component: ThemedSubmissionImportExternalComponent,
    providers: [provideSubmission()],
    pathMatch: 'full',
    data: {
      title: 'submission.import-external.page.title',
    },
  },
];

