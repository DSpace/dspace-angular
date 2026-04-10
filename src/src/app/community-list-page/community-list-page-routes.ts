import { Route } from '@angular/router';

import { i18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ThemedCommunityListPageComponent } from './themed-community-list-page.component';

/**
 * RouterModule to help navigate to the page with the community list tree
 */
export const ROUTES: Route[] = [
  {
    path: '',
    component: ThemedCommunityListPageComponent,
    pathMatch: 'full',
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    data: { title: 'communityList.tabTitle', breadcrumbKey: 'communityList' },
  },
];
