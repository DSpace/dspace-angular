import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { CollectionBreadcrumbResolver } from '../core/breadcrumbs/collection-breadcrumb.resolver';
import { DSOBreadcrumbsService } from '../core/breadcrumbs/dso-breadcrumbs.service';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { LinkService } from '../core/cache/builders/link.service';
import { CollectionPageAdministratorGuard } from './collection-page-administrator.guard';
import {
  COLLECTION_CREATE_PATH,
  COLLECTION_EDIT_PATH,
  ITEMTEMPLATE_PATH,
} from './collection-page-routing-paths';

import { CollectionPageResolver } from './collection-page.resolver';
import { CreateCollectionPageComponent } from './create-collection-page/create-collection-page.component';
import { CreateCollectionPageGuard } from './create-collection-page/create-collection-page.guard';
import { DeleteCollectionPageComponent } from './delete-collection-page/delete-collection-page.component';
import { ItemTemplatePageResolver } from './edit-item-template-page/item-template-page.resolver';
import { ThemedEditItemTemplatePageComponent } from './edit-item-template-page/themed-edit-item-template-page.component';
import { ThemedCollectionPageComponent } from './themed-collection-page.component';
import { MenuRoute } from '../shared/menu/menu-route.model';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: COLLECTION_CREATE_PATH,
        component: CreateCollectionPageComponent,
        canActivate: [AuthenticatedGuard, CreateCollectionPageGuard]
      },
      {
        path: ':id',
        resolve: {
          dso: CollectionPageResolver,
          breadcrumb: CollectionBreadcrumbResolver,
        },
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: COLLECTION_EDIT_PATH,
            loadChildren: () => import('./edit-collection-page/edit-collection-page.module')
              .then((m) => m.EditCollectionPageModule),
            canActivate: [CollectionPageAdministratorGuard]
          },
          {
            path: 'delete',
            pathMatch: 'full',
            component: DeleteCollectionPageComponent,
            canActivate: [AuthenticatedGuard],
          },
          {
            path: ITEMTEMPLATE_PATH,
            component: ThemedEditItemTemplatePageComponent,
            canActivate: [AuthenticatedGuard],
            resolve: {
              item: ItemTemplatePageResolver,
              breadcrumb: I18nBreadcrumbResolver
            },
            data: { title: 'collection.edit.template.title', breadcrumbKey: 'collection.edit.template' }
          },
          {
            path: '',
            component: ThemedCollectionPageComponent,
            pathMatch: 'full',
            data: {
              menuRoute: MenuRoute.SIMPLE_COLLECTION_PAGE,
            },
          }
        ],
      },
    ])
  ],
  providers: [
    CollectionPageResolver,
    ItemTemplatePageResolver,
    CollectionBreadcrumbResolver,
    DSOBreadcrumbsService,
    LinkService,
    CreateCollectionPageGuard,
    CollectionPageAdministratorGuard,
  ]
})
export class CollectionPageRoutingModule {

}
