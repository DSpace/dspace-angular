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
/**
 * This module defines the default component to load when navigating to the mydspace page path.
 */
export class MyDspacePageRoutingModule {
}
