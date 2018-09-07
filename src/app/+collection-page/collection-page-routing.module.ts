import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CollectionPageComponent } from './collection-page.component';
import { CollectionPageResolver } from './collection-page.resolver';
import { CreateCollectionPageComponent } from './create-collection-page/create-collection-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'create',
        component: CreateCollectionPageComponent,
        canActivate: [AuthenticatedGuard] },
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
