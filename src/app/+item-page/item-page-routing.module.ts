import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ItemPageComponent } from './simple/item-page.component';
import { FullItemPageComponent } from './full/full-item-page.component';
import { ItemPageResolver } from './item-page.resolver';
import { URLCombiner } from '../core/url-combiner/url-combiner';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ItemBreadcrumbResolver } from '../core/breadcrumbs/item-breadcrumb.resolver';
import { DSOBreadcrumbsService } from '../core/breadcrumbs/dso-breadcrumbs.service';
import { LinkService } from '../core/cache/builders/link.service';
import { UploadBitstreamComponent } from './bitstreams/upload/upload-bitstream.component';
import { UPLOAD_BITSTREAM_PATH, ITEM_EDIT_PATH, getItemModuleRoute } from './item-page-routing-paths';
import { ItemPageAdministratorGuard } from './item-page-administrator.guard';
import { MenuItemType } from '../shared/menu/initial-menus-state';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { CrisItemPageTabResolver } from '../cris-item-page/cris-item-page-tab.resolver';

export function getItemPageRoute(itemId: string) {
  return new URLCombiner(getItemModuleRoute(), itemId).toString();
}

export function getItemEditPath(id: string) {
  return new URLCombiner(getItemModuleRoute(), id, ITEM_EDIT_PATH).toString()
}

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
            component: ItemPageComponent,
            pathMatch: 'full',
          },
          {
            path: 'full',
            component: FullItemPageComponent,
          },
          {
            path: ITEM_EDIT_PATH,
            loadChildren: './edit-item-page/edit-item-page.module#EditItemPageModule',
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
    ItemPageAdministratorGuard
  ]

})
export class ItemPageRoutingModule {

}
