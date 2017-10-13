import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommunityPageComponent } from './community-page.component';
import { NormalizedCommunity } from '../core/cache/models/normalized-community.model';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: ':id', component: CommunityPageComponent, pathMatch: 'full', data: { type: NormalizedCommunity } }
    ])
  ]
})
export class CommunityPageRoutingModule {

}
