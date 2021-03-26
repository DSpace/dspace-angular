import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MyDSpaceGuard } from './my-dspace.guard';
import { ThemedMyDSpacePageComponent } from './themed-my-dspace-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ThemedMyDSpacePageComponent,
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
