import { Route } from '@angular/router';
import { MetadataImportPageComponent } from './admin-import-metadata-page/metadata-import-page.component';
import { AdminSearchPageComponent } from './admin-search-page/admin-search-page.component';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { AdminWorkflowPageComponent } from './admin-workflow-page/admin-workflow-page.component';
import { I18nBreadcrumbsService } from '../core/breadcrumbs/i18n-breadcrumbs.service';
import { AdminCurationTasksComponent } from './admin-curation-tasks/admin-curation-tasks.component';
import {
  LDN_PATH,
  NOTIFICATIONS_MODULE_PATH,
  REGISTRIES_MODULE_PATH,
  REPORTS_MODULE_PATH
} from './admin-routing-paths';
import { BatchImportPageComponent } from './admin-import-batch-page/batch-import-page.component';

const providers = [
  I18nBreadcrumbResolver,
  I18nBreadcrumbsService
];

export const ROUTES: Route[] = [
  {
    path: NOTIFICATIONS_MODULE_PATH,
    providers,
    loadChildren: () => import('./admin-notifications/admin-notifications-routes')
      .then((m) => m.ROUTES),
  },
  {
    path: REGISTRIES_MODULE_PATH,
    providers,
    loadChildren: () => import('./admin-registries/admin-registries-routes')
      .then((m) => m.ROUTES),
  },
  {
    path: 'search',
    providers,
    resolve: {breadcrumb: I18nBreadcrumbResolver},
    component: AdminSearchPageComponent,
    data: {title: 'admin.search.title', breadcrumbKey: 'admin.search'}
  },
  {
    path: 'workflow',
    providers,
    resolve: {breadcrumb: I18nBreadcrumbResolver},
    component: AdminWorkflowPageComponent,
    data: {title: 'admin.workflow.title', breadcrumbKey: 'admin.workflow'}
  },
  {
    path: 'curation-tasks',
    providers,
    resolve: {breadcrumb: I18nBreadcrumbResolver},
    component: AdminCurationTasksComponent,
    data: {title: 'admin.curation-tasks.title', breadcrumbKey: 'admin.curation-tasks'}
  },
  {
    path: 'metadata-import',
    providers,
    resolve: {breadcrumb: I18nBreadcrumbResolver},
    component: MetadataImportPageComponent,
    data: {title: 'admin.metadata-import.title', breadcrumbKey: 'admin.metadata-import'}
  },
  {
    path: 'batch-import',
    providers,
    resolve: {breadcrumb: I18nBreadcrumbResolver},
    component: BatchImportPageComponent,
    data: {title: 'admin.batch-import.title', breadcrumbKey: 'admin.batch-import'}
  },
  {
    path: 'system-wide-alert',
    providers,
    resolve: {breadcrumb: I18nBreadcrumbResolver},
    loadChildren: () => import('../system-wide-alert/system-wide-alert-routes').then((m) => m.ROUTES),
    data: {title: 'admin.system-wide-alert.title', breadcrumbKey: 'admin.system-wide-alert'}
  },
  {
    path: LDN_PATH,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'services' },
      {
        path: 'services',
        loadChildren: () => import('./admin-ldn-services/admin-ldn-services-routes')
          .then((m) => m.ROUTES),
      }
    ],
  },
  {
    path: REPORTS_MODULE_PATH,
    loadChildren: () => import('./admin-reports/admin-reports-routes')
      .then((m) => m.ROUTES),
  },
];
