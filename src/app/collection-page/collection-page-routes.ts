import { Route } from '@angular/router';

import { browseByGuard } from '../browse-by/browse-by-guard';
import { browseByI18nBreadcrumbResolver } from '../browse-by/browse-by-i18n-breadcrumb.resolver';
import { authenticatedGuard } from '../core/auth/authenticated.guard';
import { collectionBreadcrumbResolver } from '../core/breadcrumbs/collection-breadcrumb.resolver';
import { communityBreadcrumbResolver } from '../core/breadcrumbs/community-breadcrumb.resolver';
import { i18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ComcolBrowseByComponent } from '../shared/comcol/sections/comcol-browse-by/comcol-browse-by.component';
import { ComcolSearchSectionComponent } from '../shared/comcol/sections/comcol-search-section/comcol-search-section.component';
import { dsoEditMenuResolver } from '../shared/dso-page/dso-edit-menu.resolver';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { MenuItemType } from '../shared/menu/menu-item-type.model';
import { collectionPageResolver } from './collection-page.resolver';
import { collectionPageAdministratorGuard } from './collection-page-administrator.guard';
import {
  COLLECTION_CREATE_PATH,
  COLLECTION_EDIT_PATH,
  ITEMTEMPLATE_PATH,
} from './collection-page-routing-paths';
import { CreateCollectionPageComponent } from './create-collection-page/create-collection-page.component';
import { createCollectionPageGuard } from './create-collection-page/create-collection-page.guard';
import { DeleteCollectionPageComponent } from './delete-collection-page/delete-collection-page.component';
import { itemTemplatePageResolver } from './edit-item-template-page/item-template-page.resolver';
import { ThemedEditItemTemplatePageComponent } from './edit-item-template-page/themed-edit-item-template-page.component';
import { ThemedCollectionPageComponent } from './themed-collection-page.component';

export const ROUTES: Route[] = [
  {
    path: COLLECTION_CREATE_PATH,
    canActivate: [authenticatedGuard, createCollectionPageGuard],
    children: [
      {
        path: '',
        component: CreateCollectionPageComponent,
        resolve: {
          breadcrumb: i18nBreadcrumbResolver,
        },
        data: {
          breadcrumbKey: 'collection.create',
        },
      },
    ],
    data: {
      breadcrumbQueryParam: 'parent',
    },
    resolve: {
      breadcrumb: communityBreadcrumbResolver,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: ':id',
    resolve: {
      dso: collectionPageResolver,
      breadcrumb: collectionBreadcrumbResolver,
      menu: dsoEditMenuResolver,
    },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: COLLECTION_EDIT_PATH,
        loadChildren: () => import('./edit-collection-page/edit-collection-page-routes')
          .then((m) => m.ROUTES),
        canActivate: [collectionPageAdministratorGuard],
      },
      {
        path: 'delete',
        pathMatch: 'full',
        component: DeleteCollectionPageComponent,
        canActivate: [authenticatedGuard],
      },
      {
        path: ITEMTEMPLATE_PATH,
        component: ThemedEditItemTemplatePageComponent,
        canActivate: [authenticatedGuard],
        resolve: {
          item: itemTemplatePageResolver,
          breadcrumb: i18nBreadcrumbResolver,
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
            canActivate: [browseByGuard],
            resolve: {
              breadcrumb: browseByI18nBreadcrumbResolver,
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
