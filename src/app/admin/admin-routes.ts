import { Route } from '@angular/router';

import { i18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { genericAdministratorGuard } from '../core/data/feature-authorization/feature-authorization-guard/generic-administrator-guard';
import { siteAdministratorGuard } from '../core/data/feature-authorization/feature-authorization-guard/site-administrator.guard';
import { AdminCurationTasksComponent } from './admin-curation-tasks/admin-curation-tasks.component';
import { AdminEditUserAgreementComponent } from './admin-edit-user-agreement/admin-edit-user-agreement.component';
import { BatchImportPageComponent } from './admin-import-batch-page/batch-import-page.component';
import { ThemedMetadataImportPageComponent } from './admin-import-metadata-page/themed-metadata-import-page.component';
import {
  LDN_PATH,
  NOTIFICATIONS_MODULE_PATH,
  NOTIFY_DASHBOARD_MODULE_PATH,
  REGISTRIES_MODULE_PATH,
  REPORTS_MODULE_PATH,
} from './admin-routing-paths';
import { ThemedAdminSearchPageComponent } from './admin-search-page/themed-admin-search-page.component';
import { ThemedAdminWorkflowPageComponent } from './admin-workflow-page/themed-admin-workflow-page.component';
import { EditCmsMetadataComponent } from './edit-cms-metadata/edit-cms-metadata.component';

export const ROUTES: Route[] = [
  {
    path: NOTIFICATIONS_MODULE_PATH,
    loadChildren: () => import('./admin-notifications/admin-notifications-routes')
      .then((m) => m.ROUTES),
    canActivate: [siteAdministratorGuard],
  },
  {
    path: REGISTRIES_MODULE_PATH,
    loadChildren: () => import('./admin-registries/admin-registries-routes')
      .then((m) => m.ROUTES),
    canActivate: [siteAdministratorGuard],
  },
  {
    path: 'search',
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    component: ThemedAdminSearchPageComponent,
    data: { title: 'admin.search.title', breadcrumbKey: 'admin.search' },
    canActivate: [genericAdministratorGuard],
  },
  {
    path: 'workflow',
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    component: ThemedAdminWorkflowPageComponent,
    data: { title: 'admin.workflow.title', breadcrumbKey: 'admin.workflow' },
    canActivate: [siteAdministratorGuard],
  },
  {
    path: 'curation-tasks',
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    component: AdminCurationTasksComponent,
    data: { title: 'admin.curation-tasks.title', breadcrumbKey: 'admin.curation-tasks' },
    canActivate: [siteAdministratorGuard],
  },
  {
    path: 'metadata-import',
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    component: ThemedMetadataImportPageComponent,
    data: { title: 'admin.metadata-import.title', breadcrumbKey: 'admin.metadata-import' },
    canActivate: [siteAdministratorGuard],
  },
  {
    path: 'batch-import',
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    component: BatchImportPageComponent,
    data: { title: 'admin.batch-import.title', breadcrumbKey: 'admin.batch-import' },
    canActivate: [genericAdministratorGuard],
  },
  {
    path: 'system-wide-alert',
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    loadChildren: () => import('../system-wide-alert/system-wide-alert-routes').then((m) => m.ROUTES),
    data: { title: 'admin.system-wide-alert.title', breadcrumbKey: 'admin.system-wide-alert' },
    canActivate: [siteAdministratorGuard],
  },
  {
    path: 'edit-user-agreement',
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    component: AdminEditUserAgreementComponent,
    data: { title: 'admin.edit-user-agreement.title', breadcrumbKey: 'admin.edit-user-agreement' },
    canActivate: [siteAdministratorGuard],
  },
  {
    path: 'edit-cms-metadata',
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    component: EditCmsMetadataComponent,
    data: { title: 'admin.edit-cms-metadata.title', breadcrumbKey: 'admin.edit-cms-metadata' },
    canActivate: [siteAdministratorGuard],
  },
  {
    path: LDN_PATH,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'services' },
      {
        path: 'services',
        loadChildren: () => import('./admin-ldn-services/admin-ldn-services-routes')
          .then((m) => m.ROUTES),
        canActivate: [siteAdministratorGuard],
      },
    ],
  },
  {
    path: REPORTS_MODULE_PATH,
    loadChildren: () => import('./admin-reports/admin-reports-routes')
      .then((m) => m.ROUTES),
    canActivate: [siteAdministratorGuard],
  },
  {
    path: NOTIFY_DASHBOARD_MODULE_PATH,
    loadChildren: () => import('./admin-notify-dashboard/admin-notify-dashboard-routes')
      .then((m) => m.ROUTES),
    canActivate: [siteAdministratorGuard],
  },
];
