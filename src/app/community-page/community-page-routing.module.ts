import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { CommunityBreadcrumbResolver } from '../core/breadcrumbs/community-breadcrumb.resolver';
import { DSOBreadcrumbsService } from '../core/breadcrumbs/dso-breadcrumbs.service';
import { LinkService } from '../core/cache/builders/link.service';
import { CommunityPageAdministratorGuard } from './community-page-administrator.guard';
import {
  COMMUNITY_CREATE_PATH,
  COMMUNITY_EDIT_PATH,
} from './community-page-routing-paths';

import { CommunityPageResolver } from './community-page.resolver';
import { CreateCommunityPageComponent } from './create-community-page/create-community-page.component';
import { CreateCommunityPageGuard } from './create-community-page/create-community-page.guard';
import { DeleteCommunityPageComponent } from './delete-community-page/delete-community-page.component';
import { ThemedCommunityPageComponent } from './themed-community-page.component';
import { MenuRoute } from '../shared/menu/menu-route.model';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: COMMUNITY_CREATE_PATH,
        component: CreateCommunityPageComponent,
        canActivate: [AuthenticatedGuard, CreateCommunityPageGuard]
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
            data: {
              menuRoute: MenuRoute.SIMPLE_COMMUNITY_PAGE,
            },
          }
        ],
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
