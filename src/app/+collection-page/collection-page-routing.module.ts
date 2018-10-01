import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CollectionPageComponent } from './collection-page.component';
import { CollectionPageResolver } from './collection-page.resolver';
import { CollectionItemMapperComponent } from './collection-item-mapper/collection-item-mapper.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';

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
        },
        canActivate: [AuthenticatedGuard]
      }
    ])
  ],
  providers: [
    CollectionPageResolver,
  ]
})
export class CollectionPageRoutingModule {

}
