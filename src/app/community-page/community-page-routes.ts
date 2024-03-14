import { Route } from '@angular/router';

import { BrowseByGuard } from '../browse-by/browse-by-guard';
import { BrowseByI18nBreadcrumbResolver } from '../browse-by/browse-by-i18n-breadcrumb.resolver';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { CommunityBreadcrumbResolver } from '../core/breadcrumbs/community-breadcrumb.resolver';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ComcolBrowseByComponent } from '../shared/comcol/sections/comcol-browse-by/comcol-browse-by.component';
import { ComcolSearchSectionComponent } from '../shared/comcol/sections/comcol-search-section/comcol-search-section.component';
import { DSOEditMenuResolver } from '../shared/dso-page/dso-edit-menu.resolver';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { MenuItemType } from '../shared/menu/menu-item-type.model';
import { CommunityPageResolver } from './community-page.resolver';
import { CommunityPageAdministratorGuard } from './community-page-administrator.guard';
import {
  COMMUNITY_CREATE_PATH,
  COMMUNITY_EDIT_PATH,
} from './community-page-routing-paths';
import { CreateCommunityPageComponent } from './create-community-page/create-community-page.component';
import { CreateCommunityPageGuard } from './create-community-page/create-community-page.guard';
import { DeleteCommunityPageComponent } from './delete-community-page/delete-community-page.component';
import { SubComColSectionComponent } from './sections/sub-com-col-section/sub-com-col-section.component';
import { ThemedCommunityPageComponent } from './themed-community-page.component';

export const ROUTES: Route[] = [
  {
    path: COMMUNITY_CREATE_PATH,
    component: CreateCommunityPageComponent,
    canActivate: [AuthenticatedGuard, CreateCommunityPageGuard],
  },
  {
    path: ':id',
    resolve: {
      dso: CommunityPageResolver,
      breadcrumb: CommunityBreadcrumbResolver,
      menu: DSOEditMenuResolver,
    },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: COMMUNITY_EDIT_PATH,
        loadChildren: () => import('./edit-community-page/edit-community-page-routes')
          .then((m) => m.ROUTES),
        canActivate: [CommunityPageAdministratorGuard],
      },
      {
        path: 'delete',
        pathMatch: 'full',
        component: DeleteCommunityPageComponent,
        canActivate: [AuthenticatedGuard],
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
              breadcrumb: I18nBreadcrumbResolver,
            },
            data: { breadcrumbKey: 'community.subcoms-cols' },
          },
          {
            path: 'browse/:id',
            pathMatch: 'full',
            component: ComcolBrowseByComponent,
            canActivate: [BrowseByGuard],
            resolve: {
              breadcrumb: BrowseByI18nBreadcrumbResolver,
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
