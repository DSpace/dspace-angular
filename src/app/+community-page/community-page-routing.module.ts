import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommunityPageComponent } from './community-page.component';
import { CommunityPageResolver } from './community-page.resolver';
import { CreateCommunityPageComponent } from './create-community-page/create-community-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { CreateCommunityPageGuard } from './create-community-page/create-community-page.guard';
import { DeleteCommunityPageComponent } from './delete-community-page/delete-community-page.component';
import { URLCombiner } from '../core/url-combiner/url-combiner';
import { getCommunityModulePath } from '../app-routing.module';
import { CommunityBreadcrumbResolver } from '../core/breadcrumbs/community-breadcrumb.resolver';
import { DSOBreadcrumbsService } from '../core/breadcrumbs/dso-breadcrumbs.service';
import { LinkService } from '../core/cache/builders/link.service';

export const COMMUNITY_PARENT_PARAMETER = 'parent';

export function getCommunityPageRoute(communityId: string) {
  return new URLCombiner(getCommunityModulePath(), communityId).toString();
}

export function getCommunityEditPath(id: string) {
  return new URLCombiner(getCommunityModulePath(), id, COMMUNITY_EDIT_PATH).toString()
}

export function getCommunityCreatePath() {
  return new URLCombiner(getCommunityModulePath(), COMMUNITY_CREATE_PATH).toString()
}

const COMMUNITY_CREATE_PATH = 'create';
const COMMUNITY_EDIT_PATH = 'edit';

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
          breadcrumb: CommunityBreadcrumbResolver
        },
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: COMMUNITY_EDIT_PATH,
            loadChildren: './edit-community-page/edit-community-page.module#EditCommunityPageModule',
            canActivate: [AuthenticatedGuard]
          },
          {
            path: 'delete',
            pathMatch: 'full',
            component: DeleteCommunityPageComponent,
            canActivate: [AuthenticatedGuard],
          },
          {
            path: '',
            component: CommunityPageComponent,
            pathMatch: 'full',
          }
        ]
      },
    ])
  ],
  providers: [
    CommunityPageResolver,
    CommunityBreadcrumbResolver,
    DSOBreadcrumbsService,
    LinkService,
    CreateCommunityPageGuard
  ]
})
export class CommunityPageRoutingModule {

}
