import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemPageResolver } from './item-page.resolver';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ItemBreadcrumbResolver } from '../core/breadcrumbs/item-breadcrumb.resolver';
import { DSOBreadcrumbsService } from '../core/breadcrumbs/dso-breadcrumbs.service';
import { LinkService } from '../core/cache/builders/link.service';
import { UploadBitstreamComponent } from './bitstreams/upload/upload-bitstream.component';
import { ITEM_EDIT_PATH, UPLOAD_BITSTREAM_PATH } from './item-page-routing-paths';
import { ItemPageAdministratorGuard } from './item-page-administrator.guard';
import { MenuItemType } from '../shared/menu/initial-menus-state';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { ThemedItemPageComponent } from './simple/themed-item-page.component';
import { ThemedFullItemPageComponent } from './full/themed-full-item-page.component';
import { CrisItemPageTabResolver } from '../cris-item-page/cris-item-page-tab.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        resolve: {
          dso: ItemPageResolver,
          breadcrumb: ItemBreadcrumbResolver,
          tabs: CrisItemPageTabResolver
        },
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: '',
            component: ThemedItemPageComponent,
            pathMatch: 'full',
          },
          {
            path: 'full',
            component: ThemedFullItemPageComponent,
          },
          {
            path: ITEM_EDIT_PATH,
            loadChildren: () => import('./edit-item-page/edit-item-page.module')
              .then((m) => m.EditItemPageModule),
            canActivate: [ItemPageAdministratorGuard],
            data: { title: 'submission.edit.title' }
          },
          {
            path: UPLOAD_BITSTREAM_PATH,
            component: UploadBitstreamComponent,
            canActivate: [AuthenticatedGuard]
          }
        ],
        data: {
          menu: {
            public: [{
              id: 'statistics_item_:id',
              active: true,
              visible: true,
              model: {
                type: MenuItemType.LINK,
                text: 'menu.section.statistics',
                link: 'statistics/items/:id/',
              } as LinkMenuItemModel,
            }],
          },
        },
      }
    ])
  ],
  providers: [
    ItemPageResolver,
    ItemBreadcrumbResolver,
    DSOBreadcrumbsService,
    LinkService,
    ItemPageAdministratorGuard,
  ]

})
export class ItemPageRoutingModule {

}
