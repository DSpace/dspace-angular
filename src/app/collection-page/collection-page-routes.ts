import { CollectionPageResolver } from './collection-page.resolver';
import { CreateCollectionPageComponent } from './create-collection-page/create-collection-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { CreateCollectionPageGuard } from './create-collection-page/create-collection-page.guard';
import { DeleteCollectionPageComponent } from './delete-collection-page/delete-collection-page.component';
import {
  ThemedEditItemTemplatePageComponent
} from './edit-item-template-page/themed-edit-item-template-page.component';
import { ItemTemplatePageResolver } from './edit-item-template-page/item-template-page.resolver';
import { CollectionBreadcrumbResolver } from '../core/breadcrumbs/collection-breadcrumb.resolver';
import { DSOBreadcrumbsService } from '../core/breadcrumbs/dso-breadcrumbs.service';
import { LinkService } from '../core/cache/builders/link.service';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { COLLECTION_CREATE_PATH, COLLECTION_EDIT_PATH, ITEMTEMPLATE_PATH } from './collection-page-routing-paths';
import { CollectionPageAdministratorGuard } from './collection-page-administrator.guard';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { ThemedCollectionPageComponent } from './themed-collection-page.component';
import { MenuItemType } from '../shared/menu/menu-item-type.model';
import { DSOEditMenuResolver } from '../shared/dso-page/dso-edit-menu.resolver';
import { Route } from '@angular/router';
import {
  ComcolSearchSectionComponent
} from '../shared/comcol/sections/comcol-search-section/comcol-search-section.component';
import { ComcolBrowseByComponent } from '../shared/comcol/sections/comcol-browse-by/comcol-browse-by.component';
import { BrowseByGuard } from '../browse-by/browse-by-guard';
import { BrowseByI18nBreadcrumbResolver } from '../browse-by/browse-by-i18n-breadcrumb.resolver';
import { SearchService } from '../core/shared/search/search.service';


export const ROUTES: Route[] = [
  {
    path: COLLECTION_CREATE_PATH,
    component: CreateCollectionPageComponent,
    canActivate: [AuthenticatedGuard, CreateCollectionPageGuard],
    providers: [
      CollectionPageResolver,
      ItemTemplatePageResolver,
      CollectionBreadcrumbResolver,
      DSOBreadcrumbsService,
      LinkService,
      CreateCollectionPageGuard,
      CollectionPageAdministratorGuard,
      SearchService
    ]
  },
  {
    path: ':id',
    resolve: {
      dso: CollectionPageResolver,
      breadcrumb: CollectionBreadcrumbResolver,
      menu: DSOEditMenuResolver
    },
    providers: [
      CollectionPageResolver,
      ItemTemplatePageResolver,
      CollectionBreadcrumbResolver,
      DSOBreadcrumbsService,
      LinkService,
      CreateCollectionPageGuard,
      CollectionPageAdministratorGuard,
      SearchService
    ],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: COLLECTION_EDIT_PATH,
        loadChildren: () => import('./edit-collection-page/edit-collection-page-routes')
          .then((m) => m.ROUTES),
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
      }
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
