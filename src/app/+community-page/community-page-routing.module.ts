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

export const COMMUNITY_PARENT_PARAMETER = 'parent';

export function getCommunityPageRoute(communityId: string) {
  return new URLCombiner(getCommunityModulePath(), communityId).toString();
}

export function getCommunityEditPath(id: string) {
  return new URLCombiner(getCommunityModulePath(), COMMUNITY_EDIT_PATH.replace(/:id/, id)).toString()
}

export function getCommunityCreatePath() {
  return new URLCombiner(getCommunityModulePath(), COMMUNITY_CREATE_PATH).toString()
}

const COMMUNITY_CREATE_PATH = 'create';
const COMMUNITY_EDIT_PATH = ':id/edit';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: COMMUNITY_CREATE_PATH,
        component: CreateCommunityPageComponent,
        canActivate: [AuthenticatedGuard, CreateCommunityPageGuard]
      },
      {
        path: COMMUNITY_EDIT_PATH,
        loadChildren: './edit-community-page/edit-community-page.module#EditCommunityPageModule',
        canActivate: [AuthenticatedGuard]
      },
      {
        path: ':id/delete',
        pathMatch: 'full',
        component: DeleteCommunityPageComponent,
        canActivate: [AuthenticatedGuard],
        resolve: {
          dso: CommunityPageResolver
        }
      },
      {
        path: ':id',
        component: CommunityPageComponent,
        pathMatch: 'full',
        resolve: {
          community: CommunityPageResolver
        }
      }
    ])
  ],
  providers: [
    CommunityPageResolver,
    CreateCommunityPageGuard
  ]
})
export class CommunityPageRoutingModule {

}
