import { Route } from '@angular/router';

import { authenticatedGuard } from '../core/auth/authenticated.guard';
import { pendingChangesGuard } from '../submission/edit/pending-changes/pending-changes.guard';
import { ThemedSubmissionEditComponent } from '../submission/edit/themed-submission-edit.component';

export const ROUTES: Route[] = [
  {
    path: ':id',
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        canActivate: [authenticatedGuard],
        canDeactivate: [pendingChangesGuard],
        component: ThemedSubmissionEditComponent,
        data: { title: 'submission.edit.title' },
      },
    ],
  },
];
