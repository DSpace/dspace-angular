import { Route } from '@angular/router';

import { i18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';
import { FilteredCollectionsComponent } from './filtered-collections/filtered-collections.component';
import { FilteredItemsComponent } from './filtered-items/filtered-items.component';

export const ROUTES: Route[] = [
  {
    path: 'collections',
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { title: 'admin.reports.collections.title', breadcrumbKey: 'admin.reports.collections' },
    children: [
      {
        path: '',
        component: FilteredCollectionsComponent,
      },
    ],
  },
  {
    path: 'queries',
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { title: 'admin.reports.items.title', breadcrumbKey: 'admin.reports.items' },
    children: [
      {
        path: '',
        component: FilteredItemsComponent,
      },
    ],
  },
];
