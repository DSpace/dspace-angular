import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommunityPageResolver } from './community-page.resolver';
import { CreateCommunityPageComponent } from './create-community-page/create-community-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { CreateCommunityPageGuard } from './create-community-page/create-community-page.guard';
import { DeleteCommunityPageComponent } from './delete-community-page/delete-community-page.component';
import { CommunityBreadcrumbResolver } from '../core/breadcrumbs/community-breadcrumb.resolver';
import { DSOBreadcrumbsService } from '../core/breadcrumbs/dso-breadcrumbs.service';
import { LinkService } from '../core/cache/builders/link.service';
import { COMMUNITY_EDIT_PATH, COMMUNITY_CREATE_PATH } from './community-page-routing-paths';
import { CommunityPageAdministratorGuard } from './community-page-administrator.guard';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { ThemedCommunityPageComponent } from './themed-community-page.component';
import { MenuItemType } from '../shared/menu/menu-item-type.model';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: COMMUNITY_CREATE_PATH,
        children: [
          {
            path: '',
            component: CreateCommunityPageComponent,
            resolve: {
              breadcrumb: I18nBreadcrumbResolver,
            },
            data: {
              breadcrumbKey: 'community.create',
            },
          }
        ],
        canActivate: [AuthenticatedGuard, CreateCommunityPageGuard],
        data: {
          breadcrumbQueryParam: 'parent',
        },
        resolve: {
          breadcrumb: CommunityBreadcrumbResolver,
        },
        runGuardsAndResolvers: 'always',
      },
      {
        path: ':id',
        resolve: {
          dso: CommunityPageResolver,
          breadcrumb: CommunityBreadcrumbResolver,
        },
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: COMMUNITY_EDIT_PATH,
            loadChildren: () => import('./edit-community-page/edit-community-page.module')
              .then((m) => m.EditCommunityPageModule),
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
              visible: false,
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
    ])
  ],
  providers: [
    CommunityPageResolver,
    CommunityBreadcrumbResolver,
    DSOBreadcrumbsService,
    LinkService,
    CreateCommunityPageGuard,
    CommunityPageAdministratorGuard,
  ]
})
export class CommunityPageRoutingModule {

}
