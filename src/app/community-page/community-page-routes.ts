import { Route } from '@angular/router';

import { browseByGuard } from '../browse-by/browse-by-guard';
import { browseByI18nBreadcrumbResolver } from '../browse-by/browse-by-i18n-breadcrumb.resolver';
import { authenticatedGuard } from '../core/auth/authenticated.guard';
import { communityBreadcrumbResolver } from '../core/breadcrumbs/community-breadcrumb.resolver';
import { i18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ComcolBrowseByComponent } from '../shared/comcol/sections/comcol-browse-by/comcol-browse-by.component';
import { ComcolSearchSectionComponent } from '../shared/comcol/sections/comcol-search-section/comcol-search-section.component';
import { dsoEditMenuResolver } from '../shared/dso-page/dso-edit-menu.resolver';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { MenuItemType } from '../shared/menu/menu-item-type.model';
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
      menu: dsoEditMenuResolver,
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
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: ComcolSearchSectionComponent,
          },
          {
            path: 'subcoms-cols',
            pathMatch: 'full',
            component: SubComColSectionComponent,
            resolve: {
              breadcrumb: i18nBreadcrumbResolver,
            },
            data: { breadcrumbKey: 'community.subcoms-cols' },
          },
          {
            path: 'browse/:id',
            pathMatch: 'full',
            component: ComcolBrowseByComponent,
            canActivate: [browseByGuard],
            resolve: {
              breadcrumb: browseByI18nBreadcrumbResolver,
            },
            data: { breadcrumbKey: 'browse.metadata' },
          },
        ],
      },
    ],
    data: {
      menu: {
        public: [{
          id: 'statistics_community_:id',
          active: true,
          visible: true,
          index: 2,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.statistics',
            link: 'statistics/communities/:id/',
          } as LinkMenuItemModel,
        }],
      },
    },
  },
];
