import { Route } from '@angular/router';

import { collectionPageResolver } from '../collection-page/collection-page.resolver';
import { communityPageResolver } from '../community-page/community-page.resolver';
import { i18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { statisticsAdministratorGuard } from '../core/data/feature-authorization/feature-authorization-guard/statistics-administrator.guard';
import { statisticsLoginGuard } from '../core/data/feature-authorization/feature-authorization-guard/statistics-login.guard';
import { statisticsWorkflowGuard } from '../core/data/feature-authorization/feature-authorization-guard/statistics-workflow.guard';
import { ThemedCollectionStatisticsPageComponent } from './collection-statistics-page/themed-collection-statistics-page.component';
import { ThemedCommunityStatisticsPageComponent } from './community-statistics-page/themed-community-statistics-page.component';
import { ThemedItemStatisticsPageComponent } from './item-statistics-page/themed-item-statistics-page.component';
import { LoginStatisticsPageComponent } from './login-statistics-page/login-statistics-page.component';
import { ThemedSiteStatisticsPageComponent } from './site-statistics-page/themed-site-statistics-page.component';
import { statisticsItemPageResolver } from './statistics-item-page.resolver';
import { WorkflowStatisticsPageComponent } from './workflow-statistics-page/workflow-statistics-page.component';

export const ROUTES: Route[] = [
  {
    path: '',
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    data: {
      title: 'statistics.title',
      breadcrumbKey: 'statistics',
      type: 'site',
    },
    children: [
      {
        path: '',
        component: ThemedSiteStatisticsPageComponent,
      },
    ],
    canActivate: [statisticsAdministratorGuard],
  },
  {
    path: 'login',
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    data: {
      title: 'statistics.login.title',
      breadcrumbKey: 'statistics.login',
    },
    children: [
      {
        path: '',
        component: LoginStatisticsPageComponent,
      },
    ],
    canActivate: [statisticsLoginGuard],
  },
  {
    path: 'workflow',
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    data: {
      title: 'statistics.workflow.title',
      breadcrumbKey: 'statistics.workflow',
    },
    children: [
      {
        path: '',
        component: WorkflowStatisticsPageComponent,
      },
    ],
    canActivate: [statisticsWorkflowGuard],
  },
  {
    path: `items/:id`,
    resolve: {
      scope: statisticsItemPageResolver,
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
