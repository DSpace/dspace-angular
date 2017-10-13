import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CollectionPageComponent } from './collection-page.component';
import { NormalizedCollection } from '../core/cache/models/normalized-collection.model';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: ':id', component: CollectionPageComponent, pathMatch: 'full', data: { type: NormalizedCollection } }
    ])
  ]
})
export class CollectionPageRoutingModule {

}
