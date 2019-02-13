import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CollectionPageComponent } from './collection-page.component';
import { CollectionPageResolver } from './collection-page.resolver';
import { CreateCollectionPageComponent } from './create-collection-page/create-collection-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { EditCollectionPageComponent } from './edit-collection-page/edit-collection-page.component';
import { CreateCollectionPageGuard } from './create-collection-page/create-collection-page.guard';
import { DeleteCollectionPageComponent } from './delete-collection-page/delete-collection-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'create',
        component: CreateCollectionPageComponent,
        canActivate: [AuthenticatedGuard, CreateCollectionPageGuard]
      },
      {
        path: ':id/edit',
        pathMatch: 'full',
        component: EditCollectionPageComponent,
        canActivate: [AuthenticatedGuard],
        resolve: {
          dso: CollectionPageResolver
        }
      },
      {
        path: ':id/delete',
        pathMatch: 'full',
        component: DeleteCollectionPageComponent,
        canActivate: [AuthenticatedGuard],
        resolve: {
          dso: CollectionPageResolver
        }
      },
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
    CreateCollectionPageGuard
  ]
})
export class CollectionPageRoutingModule {

}
