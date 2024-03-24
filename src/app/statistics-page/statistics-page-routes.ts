import { Route } from '@angular/router';

import { CollectionPageResolver } from '../collection-page/collection-page.resolver';
import { CommunityPageResolver } from '../community-page/community-page.resolver';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { StatisticsAdministratorGuard } from '../core/data/feature-authorization/feature-authorization-guard/statistics-administrator.guard';
import { ItemResolver } from '../item-page/item.resolver';
import { ThemedCollectionStatisticsPageComponent } from './collection-statistics-page/themed-collection-statistics-page.component';
import { ThemedCommunityStatisticsPageComponent } from './community-statistics-page/themed-community-statistics-page.component';
import { ThemedItemStatisticsPageComponent } from './item-statistics-page/themed-item-statistics-page.component';
import { ThemedSiteStatisticsPageComponent } from './site-statistics-page/themed-site-statistics-page.component';

export const ROUTES: Route[] = [
  {
    path: '',
    resolve: {
      breadcrumb: I18nBreadcrumbResolver,
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
    ],
    canActivate: [StatisticsAdministratorGuard],
  },
  {
    path: `items/:id`,
    resolve: {
      scope: ItemResolver,
      breadcrumb: I18nBreadcrumbResolver,
    },
    data: {
      title: 'statistics.title',
      breadcrumbKey: 'statistics',
    },
    component: ThemedItemStatisticsPageComponent,
    canActivate: [StatisticsAdministratorGuard],
  },
  {
    path: `collections/:id`,
    resolve: {
      scope: CollectionPageResolver,
      breadcrumb: I18nBreadcrumbResolver,
    },
    data: {
      title: 'statistics.title',
      breadcrumbKey: 'statistics',
    },
    component: ThemedCollectionStatisticsPageComponent,
    canActivate: [StatisticsAdministratorGuard],
  },
  {
    path: `communities/:id`,
    resolve: {
      scope: CommunityPageResolver,
      breadcrumb: I18nBreadcrumbResolver,
    },
    data: {
      title: 'statistics.title',
      breadcrumbKey: 'statistics',
    },
    component: ThemedCommunityStatisticsPageComponent,
    canActivate: [StatisticsAdministratorGuard],
  },
];
