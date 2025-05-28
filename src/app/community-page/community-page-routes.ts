import { Route } from '@angular/router';

import { browseByGuard } from '../browse-by/browse-by-guard';
import { browseByI18nBreadcrumbResolver } from '../browse-by/browse-by-i18n-breadcrumb.resolver';
import { authenticatedGuard } from '../core/auth/authenticated.guard';
import { communityBreadcrumbResolver } from '../core/breadcrumbs/community-breadcrumb.resolver';
import { i18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ComcolBrowseByComponent } from '../shared/comcol/sections/comcol-browse-by/comcol-browse-by.component';
import { ComcolSearchSectionComponent } from '../shared/comcol/sections/comcol-search-section/comcol-search-section.component';
import { MenuRoute } from '../shared/menu/menu-route.model';
import { viewTrackerResolver } from '../statistics/angulartics/dspace/view-tracker.resolver';
import { communityPageResolver } from './community-page.resolver';
import { communityPageAdministratorGuard } from './community-page-administrator.guard';
import {
  COMMUNITY_CREATE_PATH,
  COMMUNITY_EDIT_PATH,
} from './community-page-routing-paths';
import { CreateCommunityPageComponent } from './create-community-page/create-community-page.component';
import { createCommunityPageGuard } from './create-community-page/create-community-page.guard';
import { DeleteCommunityPageComponent } from './delete-community-page/delete-community-page.component';
import { SubComColSectionComponent } from './sections/sub-com-col-section/sub-com-col-section.component';
import { ThemedCommunityPageComponent } from './themed-community-page.component';

export const ROUTES: Route[] = [
  {
    path: COMMUNITY_CREATE_PATH,
    children: [
      {
        path: '',
        component: CreateCommunityPageComponent,
        resolve: {
          breadcrumb: i18nBreadcrumbResolver,
        },
        data: {
          breadcrumbKey: 'community.create',
        },
      },
    ],
    canActivate: [authenticatedGuard, createCommunityPageGuard],
    data: {
      breadcrumbQueryParam: 'parent',
    },
    resolve: {
      breadcrumb: communityBreadcrumbResolver,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: ':id',
    resolve: {
      dso: communityPageResolver,
      breadcrumb: communityBreadcrumbResolver,
    },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: COMMUNITY_EDIT_PATH,
        loadChildren: () => import('./edit-community-page/edit-community-page-routes')
          .then((m) => m.ROUTES),
        canActivate: [communityPageAdministratorGuard],
      },
      {
        path: 'delete',
        pathMatch: 'full',
        component: DeleteCommunityPageComponent,
        canActivate: [authenticatedGuard],
      },
      {
        path: '',
        component: ThemedCommunityPageComponent,
        data: {
          menuRoute: MenuRoute.COMMUNITY_PAGE,
        },
        resolve: {
          tracking: viewTrackerResolver,
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: ComcolSearchSectionComponent,
          },
          {
            path: 'search',
            pathMatch: 'full',
            component: ComcolSearchSectionComponent,
            resolve: {
              breadcrumb: i18nBreadcrumbResolver,
            },
            data: {
              breadcrumbKey: 'community.search',
              menuRoute: MenuRoute.COMMUNITY_PAGE,
              enableRSS: true,
            },
          },
          {
            path: 'subcoms-cols',
            pathMatch: 'full',
            component: SubComColSectionComponent,
            resolve: {
              breadcrumb: i18nBreadcrumbResolver,
            },
            data: {
              breadcrumbKey: 'community.subcoms-cols',
              menuRoute: MenuRoute.COMMUNITY_PAGE,
            },
          },
          {
            path: 'browse/:id',
            pathMatch: 'full',
            component: ComcolBrowseByComponent,
            canActivate: [browseByGuard],
            resolve: {
              breadcrumb: browseByI18nBreadcrumbResolver,
            },
            data: {
              breadcrumbKey: 'browse.metadata',
              menuRoute: MenuRoute.COMMUNITY_PAGE,
            },
          },
        ],
      },
    ],
  },
];
