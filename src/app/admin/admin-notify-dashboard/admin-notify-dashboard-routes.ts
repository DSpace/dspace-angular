import { Route } from '@angular/router';
import {
  i18nBreadcrumbResolver,
  notifyInfoGuard,
  siteAdministratorGuard,
} from '@dspace/core';

import { AdminNotifyDashboardComponent } from './admin-notify-dashboard.component';
import { AdminNotifyIncomingComponent } from './admin-notify-logs/admin-notify-incoming/admin-notify-incoming.component';
import { AdminNotifyOutgoingComponent } from './admin-notify-logs/admin-notify-outgoing/admin-notify-outgoing.component';

export const ROUTES: Route[] = [
  {
    canActivate: [siteAdministratorGuard, notifyInfoGuard],
    path: '',
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    component: AdminNotifyDashboardComponent,
    pathMatch: 'full',
    data: {
      title: 'admin.notify.dashboard.page.title',
      breadcrumbKey: 'admin.notify.dashboard',
    },
  },
  {
    path: 'inbound',
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    component: AdminNotifyIncomingComponent,
    canActivate: [siteAdministratorGuard, notifyInfoGuard],
    data: {
      title: 'admin.notify.dashboard.page.title',
      breadcrumbKey: 'admin.notify.dashboard',
    },
  },
  {
    path: 'outbound',
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    component: AdminNotifyOutgoingComponent,
    canActivate: [siteAdministratorGuard, notifyInfoGuard],
    data: {
      title: 'admin.notify.dashboard.page.title',
      breadcrumbKey: 'admin.notify.dashboard',
    },
  },
];
