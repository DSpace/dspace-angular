import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EditCollectionPageComponent } from './edit-collection-page.component';
import { CollectionMetadataComponent } from './collection-metadata/collection-metadata.component';
import { CollectionRolesComponent } from './collection-roles/collection-roles.component';
import { CollectionSourceComponent } from './collection-source/collection-source.component';
import { CollectionCurateComponent } from './collection-curate/collection-curate.component';
import { I18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';

/**
 * Routing module that handles the routing for the Edit Collection page administrator functionality
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver
        },
        data: { breadcrumbKey: 'collection.edit' },
        component: EditCollectionPageComponent,
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
              hideReturnButton: true,
              showBreadcrumbs: true
            }
          },
          {
            path: 'roles',
            component: CollectionRolesComponent,
            data: { title: 'collection.edit.tabs.roles.title', showBreadcrumbs: true }
          },
          {
            path: 'source',
            component: CollectionSourceComponent,
            data: { title: 'collection.edit.tabs.source.title', showBreadcrumbs: true }
          },
          {
            path: 'curate',
            component: CollectionCurateComponent,
            data: { title: 'collection.edit.tabs.curate.title', showBreadcrumbs: true }
          }
        ]
      }
    ])
  ]
})
export class EditCollectionPageRoutingModule {

}
