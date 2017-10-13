import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommunityPageComponent } from './community-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: ':id', component: CommunityPageComponent, pathMatch: 'full' }
    ])
  ]
})
export class CommunityPageRoutingModule {

}
