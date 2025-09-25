import { Route } from '@angular/router';

import { authenticatedGuard } from '../core/auth/authenticated.guard';
import { i18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ThemedFullItemPageComponent } from '../item-page/full/themed-full-item-page.component';
import { ThemedSubmissionEditComponent } from '../submission/edit/themed-submission-edit.component';
import { itemFromWorkspaceResolver } from './item-from-workspace.resolver';
import { ItemFromWorkspaceBreadcrumbResolver } from './item-from-workspace-breadcrumb.resolver';
import { workspaceItemPageResolver } from './workspace-item-page.resolver';
import { ThemedWorkspaceItemsDeletePageComponent } from './workspaceitems-delete-page/themed-workspaceitems-delete-page.component';

export const ROUTES: Route[] = [
  {
    path: '',
    redirectTo: '/home', pathMatch: 'full',
  },
  {
    path: ':id',
    resolve: {
      breadcrumb: ItemFromWorkspaceBreadcrumbResolver,
      wsi: workspaceItemPageResolver,
    },
    children: [
      {
        canActivate: [authenticatedGuard],
        path: 'edit',
        component: ThemedSubmissionEditComponent,
        resolve: {
          breadcrumb: i18nBreadcrumbResolver,
        },
        data: { title: 'submission.edit.title', breadcrumbKey: 'submission.edit' },
      },
      {
        canActivate: [authenticatedGuard],
        path: 'view',
        component: ThemedFullItemPageComponent,
        resolve: {
          dso: itemFromWorkspaceResolver,
          breadcrumb: i18nBreadcrumbResolver,
        },
        data: { title: 'workspace-item.view.title', breadcrumbKey: 'workspace-item.view' },
      },
      {
        canActivate: [authenticatedGuard],
        path: 'delete',
        component: ThemedWorkspaceItemsDeletePageComponent,
        resolve: {
          dso: itemFromWorkspaceResolver,
          breadcrumb: i18nBreadcrumbResolver,
        },
        data: { title: 'workspace-item.delete', breadcrumbKey: 'workspace-item.delete' },
      },
    ],
  },
];
