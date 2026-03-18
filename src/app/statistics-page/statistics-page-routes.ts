import { Route } from '@angular/router';
import { i18nBreadcrumbResolver } from '@dspace/core/breadcrumbs/i18n-breadcrumb.resolver';
import { statisticsAdministratorGuard } from '@dspace/core/data/feature-authorization/feature-authorization-guard/statistics-administrator.guard';

import { collectionPageResolver } from '../collection-page/collection-page.resolver';
import { communityPageResolver } from '../community-page/community-page.resolver';
import { itemResolver } from '../item-page/item.resolver';
import { ThemedCollectionStatisticsPageComponent } from './collection-statistics-page/themed-collection-statistics-page.component';
import { ThemedCommunityStatisticsPageComponent } from './community-statistics-page/themed-community-statistics-page.component';
import { ThemedItemStatisticsPageComponent } from './item-statistics-page/themed-item-statistics-page.component';
import { ThemedSiteStatisticsPageComponent } from './site-statistics-page/themed-site-statistics-page.component';

import { authenticatedGuard } from '../core/auth/authenticated.guard';

export const ROUTES: Route[] = [
  {
    path: '',
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    data: {
      title: 'statistics.title',
      breadcrumbKey: 'statistics',
    },
    children: [
      {
        path: '',
        component: ThemedSiteStatisticsPageComponent,
      },
      {
        path: 'admin-dashboard',
        resolve: {
          breadcrumb: i18nBreadcrumbResolver,
        },
        data: {
          title: 'admin.dashboard.title',
          breadcrumbKey: 'admin.dashboard',
        },
        loadComponent: () => import('../../themes/custom/app/admin/admin-dashboard-page/admin-dashboard-page.component').then((m) => m.AdminDashboardPageComponent),
        canActivate: [authenticatedGuard],
      },
    ],
    canActivate: [statisticsAdministratorGuard],
  },
  {
    path: `items/:id`,
    resolve: {
      scope: itemResolver,
      breadcrumb: i18nBreadcrumbResolver,
    },
    data: {
      title: 'statistics.title',
      breadcrumbKey: 'statistics',
    },
    component: ThemedItemStatisticsPageComponent,
    canActivate: [statisticsAdministratorGuard],
  },
  {
    path: `entities/:entityType/:id`,
    resolve: {
      scope: itemResolver,
      breadcrumb: i18nBreadcrumbResolver,
    },
    data: {
      title: 'statistics.title',
      breadcrumbKey: 'statistics',
    },
    component: ThemedItemStatisticsPageComponent,
    canActivate: [statisticsAdministratorGuard],
  },
  {
    path: `collections/:id`,
    resolve: {
      scope: collectionPageResolver,
      breadcrumb: i18nBreadcrumbResolver,
    },
    data: {
      title: 'statistics.title',
      breadcrumbKey: 'statistics',
    },
    component: ThemedCollectionStatisticsPageComponent,
    canActivate: [statisticsAdministratorGuard],
  },
  {
    path: `communities/:id`,
    resolve: {
      scope: communityPageResolver,
      breadcrumb: i18nBreadcrumbResolver,
    },
    data: {
      title: 'statistics.title',
      breadcrumbKey: 'statistics',
    },
    component: ThemedCommunityStatisticsPageComponent,
    canActivate: [statisticsAdministratorGuard],
  },
];
