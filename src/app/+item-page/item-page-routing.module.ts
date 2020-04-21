import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ItemPageComponent } from './simple/item-page.component';
import { FullItemPageComponent } from './full/full-item-page.component';
import { ItemPageResolver } from './item-page.resolver';
import { URLCombiner } from '../core/url-combiner/url-combiner';
import { getItemModulePath } from '../app-routing.module';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ItemBreadcrumbResolver } from '../core/breadcrumbs/item-breadcrumb.resolver';
import { DSOBreadcrumbsService } from '../core/breadcrumbs/dso-breadcrumbs.service';
import { LinkService } from '../core/cache/builders/link.service';
import { UploadBitstreamComponent } from './bitstreams/upload/upload-bitstream.component';

export function getItemPageRoute(itemId: string) {
  return new URLCombiner(getItemModulePath(), itemId).toString();
}

export function getItemEditPath(id: string) {
  return new URLCombiner(getItemModulePath(), id, ITEM_EDIT_PATH).toString()
}

const ITEM_EDIT_PATH = 'edit';
const UPLOAD_BITSTREAM_PATH = 'bitstreams/new';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        resolve: {
          item: ItemPageResolver,
          breadcrumb: ItemBreadcrumbResolver
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
            canActivate: [AuthenticatedGuard]
          },
          {
            path: UPLOAD_BITSTREAM_PATH,
            component: UploadBitstreamComponent,
            canActivate: [AuthenticatedGuard]
          }
        ],
      }
    ])
  ],
  providers: [
    ItemPageResolver,
    ItemBreadcrumbResolver,
    DSOBreadcrumbsService,
    LinkService
  ]

})
export class ItemPageRoutingModule {

}
