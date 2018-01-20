import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyDSpacePageComponent } from './my-dspace-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: MyDSpacePageComponent, pathMatch: 'full', data: {title: 'mydspace.title'}}
    ])
  ]
})
export class MyDspacePageRoutingModule {
}
