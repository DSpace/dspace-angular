import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommunityPageComponent } from './community-page.component';
import { CommunityPageResolver } from './community-page.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
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
