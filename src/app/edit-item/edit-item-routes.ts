import { Route } from '@angular/router';
import { editItemBreadcrumbResolver } from '@dspace/core/breadcrumbs/edit-item-breadcrumb.resolver';
import { i18nBreadcrumbResolver } from '@dspace/core/breadcrumbs/i18n-breadcrumb.resolver';

import { authenticatedGuard } from '../core/auth/authenticated.guard';
import { pendingChangesGuard } from '../submission/edit/pending-changes/pending-changes.guard';
import { ThemedSubmissionEditComponent } from '../submission/edit/themed-submission-edit.component';

export const ROUTES: Route[] = [
  {
    path: ':id',
    runGuardsAndResolvers: 'always',
    resolve: {
      breadcrumb: editItemBreadcrumbResolver,
    },
    children: [
      {
        path: '',
        canActivate: [authenticatedGuard],
        canDeactivate: [pendingChangesGuard],
        component: ThemedSubmissionEditComponent,
        resolve: {
          breadcrumb: i18nBreadcrumbResolver,
        },
        data: {
          title: 'submission.edit.title',
          breadcrumbKey: 'submission.edit.item',
        },
      },
    ],
  },
];
