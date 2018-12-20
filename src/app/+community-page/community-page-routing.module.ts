import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommunityPageComponent } from './community-page.component';
import { CommunityPageResolver } from './community-page.resolver';
import { CreateCommunityPageComponent } from './create-community-page/create-community-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { EditCommunityPageComponent } from './edit-community-page/edit-community-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'create',
        component: CreateCommunityPageComponent,
        canActivate: [AuthenticatedGuard]
      },
      { path: ':id/edit',
        pathMatch: 'full',
        component: EditCommunityPageComponent,
        canActivate: [AuthenticatedGuard],
        resolve: {
          community: CommunityPageResolver
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
  ]
})
export class CommunityPageRoutingModule {

}
