import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CollectionPageComponent } from './collection-page.component';
import { CollectionPageResolver } from './collection-page.resolver';
import { CreateCollectionPageComponent } from './create-collection-page/create-collection-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { EditCollectionPageComponent } from './edit-collection-page/edit-collection-page.component';
import { CreateCollectionPageGuard } from './create-collection-page/create-collection-page.guard';
import { DeleteCollectionPageComponent } from './delete-collection-page/delete-collection-page.component';
import { URLCombiner } from '../core/url-combiner/url-combiner';
import { getCollectionModulePath } from '../app-routing.module';

export const COLLECTION_PARENT_PARAMETER = 'parent';

export function getCollectionPageRoute(collectionId: string) {
  return new URLCombiner(getCollectionModulePath(), collectionId).toString();
}

export function getCollectionEditPath(id: string) {
  return new URLCombiner(getCollectionModulePath(), COLLECTION_EDIT_PATH.replace(/:id/, id)).toString()
}

export function getCollectionCreatePath() {
  return new URLCombiner(getCollectionModulePath(), COLLECTION_CREATE_PATH).toString()
}

const COLLECTION_CREATE_PATH = 'create';
const COLLECTION_EDIT_PATH = ':id/edit';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: COLLECTION_CREATE_PATH,
        component: CreateCollectionPageComponent,
        canActivate: [AuthenticatedGuard, CreateCollectionPageGuard]
      },
      {
        path: COLLECTION_EDIT_PATH,
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
