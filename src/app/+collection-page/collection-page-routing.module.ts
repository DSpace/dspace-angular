import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CollectionPageComponent } from './collection-page.component';
import { CollectionPageResolver } from './collection-page.resolver';
import { CollectionItemMapperComponent } from './collection-item-mapper/collection-item-mapper.component';

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
      },
      {
        path: ':id/mapper',
        component: CollectionItemMapperComponent,
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
