import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommunityPageComponent } from './community-page.component';
import { CreateCommunityPageComponent } from './create-community-page/create-community-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'create', component: CreateCommunityPageComponent, canActivate: [AuthenticatedGuard] },
      { path: ':id', component: CommunityPageComponent, pathMatch: 'full' }
    ])
  ]
})
export class CommunityPageRoutingModule {

}
