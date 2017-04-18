import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CollectionPageComponent } from './collection-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'collections/:id', component: CollectionPageComponent }
    ])
  ]
})
export class CollectionPageRoutingModule { }
