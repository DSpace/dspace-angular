import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CollectionPageComponent } from './collection-page.component';
import { CollectionPageResolver } from './collection-page.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        component: CollectionPageComponent,
        pathMatch: 'full',
        resolve: {
          collection: CollectionPageResolver
        }
      }
    ])
  ],
  providers: [
    CollectionPageResolver,
  ]
})
export class CollectionPageRoutingModule {

}
