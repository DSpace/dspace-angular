import { Route } from '@angular/router';

import { I18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';
import { NotifyInfoGuard } from '../../core/coar-notify/notify-info/notify-info.guard';
import { SiteAdministratorGuard } from '../../core/data/feature-authorization/feature-authorization-guard/site-administrator.guard';
import { AdminNotifyDashboardComponent } from './admin-notify-dashboard.component';
import { AdminNotifyIncomingComponent } from './admin-notify-logs/admin-notify-incoming/admin-notify-incoming.component';
import { AdminNotifyOutgoingComponent } from './admin-notify-logs/admin-notify-outgoing/admin-notify-outgoing.component';

export const ROUTES: Route[] = [
  {
    canActivate: [SiteAdministratorGuard, NotifyInfoGuard],
    path: '',
    resolve: {
      breadcrumb: I18nBreadcrumbResolver,
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
      breadcrumb: I18nBreadcrumbResolver,
    },
    component: AdminNotifyIncomingComponent,
    canActivate: [SiteAdministratorGuard, NotifyInfoGuard],
    data: {
      title: 'admin.notify.dashboard.page.title',
      breadcrumbKey: 'admin.notify.dashboard',
    },
  },
  {
    path: 'outbound',
    resolve: {
      breadcrumb: I18nBreadcrumbResolver,
    },
    component: AdminNotifyOutgoingComponent,
    canActivate: [SiteAdministratorGuard, NotifyInfoGuard],
    data: {
      title: 'admin.notify.dashboard.page.title',
      breadcrumbKey: 'admin.notify.dashboard',
    },
  },
];
