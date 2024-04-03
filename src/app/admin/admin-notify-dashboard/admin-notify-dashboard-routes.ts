import {
  mapToCanActivate,
  Route,
} from '@angular/router';

import { i18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';
import { NotifyInfoGuard } from '../../core/coar-notify/notify-info/notify-info.guard';
import { SiteAdministratorGuard } from '../../core/data/feature-authorization/feature-authorization-guard/site-administrator.guard';
import { AdminNotifyDashboardComponent } from './admin-notify-dashboard.component';
import { AdminNotifyIncomingComponent } from './admin-notify-logs/admin-notify-incoming/admin-notify-incoming.component';
import { AdminNotifyOutgoingComponent } from './admin-notify-logs/admin-notify-outgoing/admin-notify-outgoing.component';

export const ROUTES: Route[] = [
  {
    canActivate: [...mapToCanActivate([SiteAdministratorGuard]), NotifyInfoGuard],
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
    canActivate: [...mapToCanActivate([SiteAdministratorGuard]), NotifyInfoGuard],
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
    canActivate: [...mapToCanActivate([SiteAdministratorGuard]), NotifyInfoGuard],
    data: {
      title: 'admin.notify.dashboard.page.title',
      breadcrumbKey: 'admin.notify.dashboard',
    },
  },
];
