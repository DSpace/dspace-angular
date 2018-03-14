import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyDSpacePageComponent } from './my-dspace-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        // canActivate: [AuthenticatedGuard],
        path: '',
        component: MyDSpacePageComponent,
        data: {title: 'mydspace.title'}}
    ])
  ]
})
export class MyDspacePageRoutingModule {
}
