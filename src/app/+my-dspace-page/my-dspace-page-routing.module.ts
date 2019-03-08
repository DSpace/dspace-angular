import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyDSpacePageComponent } from './my-dspace-page.component';
import { MyDSpaceGuard } from './my-dspace.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: MyDSpacePageComponent,
        data: { title: 'mydspace.title' },
        canActivate: [
          MyDSpaceGuard
        ]
      }
    ])
  ]
})
export class MyDspacePageRoutingModule {
}
