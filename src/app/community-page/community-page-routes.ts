import { Route } from '@angular/router';

import { CommunityPageResolver } from './community-page.resolver';
import { CreateCommunityPageComponent } from './create-community-page/create-community-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { CreateCommunityPageGuard } from './create-community-page/create-community-page.guard';
import { DeleteCommunityPageComponent } from './delete-community-page/delete-community-page.component';
import { CommunityBreadcrumbResolver } from '../core/breadcrumbs/community-breadcrumb.resolver';
import { DSOBreadcrumbsService } from '../core/breadcrumbs/dso-breadcrumbs.service';
import { LinkService } from '../core/cache/builders/link.service';
import { COMMUNITY_CREATE_PATH, COMMUNITY_EDIT_PATH } from './community-page-routing-paths';
import { CommunityPageAdministratorGuard } from './community-page-administrator.guard';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { ThemedCommunityPageComponent } from './themed-community-page.component';
import { MenuItemType } from '../shared/menu/menu-item-type.model';
import { DSOEditMenuResolver } from '../shared/dso-page/dso-edit-menu.resolver';

export const ROUTES: Route[] = [
  {
    path: COMMUNITY_CREATE_PATH,
    component: CreateCommunityPageComponent,
    canActivate: [AuthenticatedGuard, CreateCommunityPageGuard],
    providers: [
      CommunityPageResolver,
      CommunityBreadcrumbResolver,
      DSOBreadcrumbsService,
      LinkService,
      CreateCommunityPageGuard,
      CommunityPageAdministratorGuard,
    ]
  },
  {
    path: ':id',
    resolve: {
      dso: CommunityPageResolver,
      breadcrumb: CommunityBreadcrumbResolver,
      menu: DSOEditMenuResolver
    },
    providers: [
      CommunityPageResolver,
      CommunityBreadcrumbResolver,
      DSOBreadcrumbsService,
      LinkService,
      CreateCommunityPageGuard,
      CommunityPageAdministratorGuard,
    ],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: COMMUNITY_EDIT_PATH,
        loadChildren: () => import('./edit-community-page/edit-community-page-routes')
          .then((m) => m.ROUTES),
        canActivate: [CommunityPageAdministratorGuard]
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
        pathMatch: 'full',
      }
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
