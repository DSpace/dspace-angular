import { Route } from '@angular/router';

import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { CommunityListService } from './community-list-service';
import { ThemedCommunityListPageComponent } from './themed-community-list-page.component';

/**
 * RouterModule to help navigate to the page with the community list tree
 */
export const ROUTES: Route[] = [
  {
    path: '',
    component: ThemedCommunityListPageComponent,
    pathMatch: 'full',
    providers: [CommunityListService],
    resolve: {
      breadcrumb: I18nBreadcrumbResolver,
    },
    data: { title: 'communityList.tabTitle', breadcrumbKey: 'communityList' },
  },
];
