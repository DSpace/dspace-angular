import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EditCollectionPageComponent } from './edit-collection-page.component';
import { CollectionPageResolver } from '../collection-page.resolver';
import { CollectionMetadataComponent } from './collection-metadata/collection-metadata.component';
import { CollectionRolesComponent } from './collection-roles/collection-roles.component';
import { CollectionSourceComponent } from './collection-source/collection-source.component';
import { CollectionCurateComponent } from './collection-curate/collection-curate.component';

/**
 * Routing module that handles the routing for the Edit Collection page administrator functionality
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: EditCollectionPageComponent,
        resolve: {
          dso: CollectionPageResolver
        },
        children: [
          {
            path: '',
            redirectTo: 'metadata',
            pathMatch: 'full'
          },
          {
            path: 'metadata',
            component: CollectionMetadataComponent,
            data: {
              title: 'collection.edit.tabs.metadata.title',
              hideReturnButton: true
            }
          },
          {
            path: 'roles',
            component: CollectionRolesComponent,
            data: { title: 'collection.edit.tabs.roles.title' }
          },
          {
            path: 'source',
            component: CollectionSourceComponent,
            data: { title: 'collection.edit.tabs.source.title' }
          },
          {
            path: 'curate',
            component: CollectionCurateComponent,
            data: { title: 'collection.edit.tabs.curate.title' }
          }
        ]
      }
    ])
  ],
  providers: [
    CollectionPageResolver,
  ]
})
export class EditCollectionPageRoutingModule {

}
