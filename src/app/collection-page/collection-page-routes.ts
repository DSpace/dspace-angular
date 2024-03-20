import { Route } from '@angular/router';

import { BrowseByGuard } from '../browse-by/browse-by-guard';
import { BrowseByI18nBreadcrumbResolver } from '../browse-by/browse-by-i18n-breadcrumb.resolver';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { CollectionBreadcrumbResolver } from '../core/breadcrumbs/collection-breadcrumb.resolver';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ComcolBrowseByComponent } from '../shared/comcol/sections/comcol-browse-by/comcol-browse-by.component';
import { ComcolSearchSectionComponent } from '../shared/comcol/sections/comcol-search-section/comcol-search-section.component';
import { DSOEditMenuResolver } from '../shared/dso-page/dso-edit-menu.resolver';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { MenuItemType } from '../shared/menu/menu-item-type.model';
import { CollectionPageResolver } from './collection-page.resolver';
import { CollectionPageAdministratorGuard } from './collection-page-administrator.guard';
import {
  COLLECTION_CREATE_PATH,
  COLLECTION_EDIT_PATH,
  ITEMTEMPLATE_PATH,
} from './collection-page-routing-paths';
import { CreateCollectionPageComponent } from './create-collection-page/create-collection-page.component';
import { CreateCollectionPageGuard } from './create-collection-page/create-collection-page.guard';
import { DeleteCollectionPageComponent } from './delete-collection-page/delete-collection-page.component';
import { ItemTemplatePageResolver } from './edit-item-template-page/item-template-page.resolver';
import { ThemedEditItemTemplatePageComponent } from './edit-item-template-page/themed-edit-item-template-page.component';
import { ThemedCollectionPageComponent } from './themed-collection-page.component';


export const ROUTES: Route[] = [
  {
    path: COLLECTION_CREATE_PATH,
    component: CreateCollectionPageComponent,
    canActivate: [AuthenticatedGuard, CreateCollectionPageGuard],
  },
  {
    path: ':id',
    resolve: {
      dso: CollectionPageResolver,
      breadcrumb: CollectionBreadcrumbResolver,
      menu: DSOEditMenuResolver,
    },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: COLLECTION_EDIT_PATH,
        loadChildren: () => import('./edit-collection-page/edit-collection-page-routes')
          .then((m) => m.ROUTES),
        canActivate: [CollectionPageAdministratorGuard],
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
          breadcrumb: I18nBreadcrumbResolver,
        },
        data: { title: 'collection.edit.template.title', breadcrumbKey: 'collection.edit.template' },
      },
      {
        path: '',
        component: ThemedCollectionPageComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: ComcolSearchSectionComponent,
          },
          {
            path: 'browse/:id',
            pathMatch: 'full',
            component: ComcolBrowseByComponent,
            canActivate: [BrowseByGuard],
            resolve: {
              breadcrumb: BrowseByI18nBreadcrumbResolver,
            },
            data: { breadcrumbKey: 'browse.metadata' },
          },
        ],
      },
    ],
    data: {
      menu: {
        public: [{
          id: 'statistics_collection_:id',
          active: true,
          visible: true,
          index: 2,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.statistics',
            link: 'statistics/collections/:id/',
          } as LinkMenuItemModel,
        }],
      },
    },
  },
];
