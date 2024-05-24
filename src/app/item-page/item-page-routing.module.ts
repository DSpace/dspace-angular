import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { REQUEST_COPY_MODULE_PATH } from '../app-routing-paths';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { DSOBreadcrumbsService } from '../core/breadcrumbs/dso-breadcrumbs.service';
import { ItemBreadcrumbResolver } from '../core/breadcrumbs/item-breadcrumb.resolver';
import { LinkService } from '../core/cache/builders/link.service';
import { DSOEditMenuResolver } from '../shared/dso-page/dso-edit-menu.resolver';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { MenuItemType } from '../shared/menu/menu-item-type.model';
import { BitstreamRequestACopyPageComponent } from './bitstreams/request-a-copy/bitstream-request-a-copy-page.component';
import { UploadBitstreamComponent } from './bitstreams/upload/upload-bitstream.component';
import { CrisItemPageTabResolver } from './cris-item-page-tab.resolver';
import { ThemedFullItemPageComponent } from './full/themed-full-item-page.component';
import { ItemPageResolver } from './item-page.resolver';
import { ItemPageAdministratorGuard } from './item-page-administrator.guard';
import {
  ITEM_EDIT_PATH,
  ORCID_PATH,
  UPLOAD_BITSTREAM_PATH,
} from './item-page-routing-paths';
import { OrcidPageComponent } from './orcid-page/orcid-page.component';
import { OrcidPageGuard } from './orcid-page/orcid-page.guard';
import { ThemedItemPageComponent } from './simple/themed-item-page.component';
import { VersionResolver } from './version-page/version.resolver';
import { VersionPageComponent } from './version-page/version-page/version-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        resolve: {
          dso: ItemPageResolver,
          breadcrumb: ItemBreadcrumbResolver,
          menu: DSOEditMenuResolver,
        },
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: '',
            component: ThemedItemPageComponent,
            pathMatch: 'full',
            resolve: {
              tabs: CrisItemPageTabResolver,
            },
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
            data: { title: 'submission.edit.title' },
          },
          {
            path: UPLOAD_BITSTREAM_PATH,
            component: UploadBitstreamComponent,
            canActivate: [AuthenticatedGuard],
          },
          {
            path: REQUEST_COPY_MODULE_PATH,
            component: BitstreamRequestACopyPageComponent,
          },
          {
            path: ORCID_PATH,
            component: OrcidPageComponent,
            canActivate: [AuthenticatedGuard, OrcidPageGuard],
          },
          {
            path: ':tab',
            component: ThemedItemPageComponent,
            resolve: {
              tabs: CrisItemPageTabResolver,
            },
          },
        ],
        data: {
          menu: {
            public: [{
              id: 'statistics_item_:id',
              active: true,
              visible: false,
              index: 2,
              model: {
                type: MenuItemType.LINK,
                text: 'menu.section.statistics',
                link: 'statistics/items/:id/',
              } as LinkMenuItemModel,
            }],
          },
          showSocialButtons: true,
        },
      },
      {
        path: 'version',
        children: [
          {
            path: ':id',
            component: VersionPageComponent,
            resolve: {
              dso: VersionResolver,
            },
          },
        ],
      },
    ]),
  ],
  providers: [
    ItemPageResolver,
    ItemBreadcrumbResolver,
    DSOBreadcrumbsService,
    LinkService,
    ItemPageAdministratorGuard,
    VersionResolver,
    OrcidPageGuard,
    CrisItemPageTabResolver,
  ],

})
export class ItemPageRoutingModule {

}
