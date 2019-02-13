import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommunityPageComponent } from './community-page.component';
import { CommunityPageResolver } from './community-page.resolver';
import { CreateCommunityPageComponent } from './create-community-page/create-community-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { EditCommunityPageComponent } from './edit-community-page/edit-community-page.component';
import { CreateCommunityPageGuard } from './create-community-page/create-community-page.guard';
import { DeleteCommunityPageComponent } from './delete-community-page/delete-community-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'create',
        component: CreateCommunityPageComponent,
        canActivate: [AuthenticatedGuard, CreateCommunityPageGuard]
      },
      {
        path: ':id/edit',
        pathMatch: 'full',
        component: EditCommunityPageComponent,
        canActivate: [AuthenticatedGuard],
        resolve: {
          dso: CommunityPageResolver
        }
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
