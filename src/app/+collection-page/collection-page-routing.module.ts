import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CollectionPageComponent } from './collection-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: ':id', component: CollectionPageComponent, pathMatch: 'full' }
    ])
  ]
})
export class CollectionPageRoutingModule { }
