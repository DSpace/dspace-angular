import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { REQUEST_COPY_MODULE_PATH } from '../app-routing-paths';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { DSOBreadcrumbsService } from '../core/breadcrumbs/dso-breadcrumbs.service';
import { ItemBreadcrumbResolver } from '../core/breadcrumbs/item-breadcrumb.resolver';
import { LinkService } from '../core/cache/builders/link.service';
import {
  BitstreamRequestACopyPageComponent
} from './bitstreams/request-a-copy/bitstream-request-a-copy-page.component';
import { UploadBitstreamComponent } from './bitstreams/upload/upload-bitstream.component';
import { ThemedFullItemPageComponent } from './full/themed-full-item-page.component';
import { ItemPageAdministratorGuard } from './item-page-administrator.guard';
import { ITEM_EDIT_PATH, ORCID_PATH, UPLOAD_BITSTREAM_PATH, } from './item-page-routing-paths';
import { ItemPageResolver } from './item-page.resolver';
import { OrcidPageComponent } from './orcid-page/orcid-page.component';
import { OrcidPageGuard } from './orcid-page/orcid-page.guard';
import { ThemedItemPageComponent } from './simple/themed-item-page.component';
import { VersionPageComponent } from './version-page/version-page/version-page.component';
import { VersionResolver } from './version-page/version.resolver';
import { MenuRoute } from '../shared/menu/menu-route.model';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        resolve: {
          dso: ItemPageResolver,
          breadcrumb: ItemBreadcrumbResolver,
        },
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: '',
            component: ThemedItemPageComponent,
            pathMatch: 'full',
            data: {
              menuRoute: MenuRoute.SIMPLE_ITEM_PAGE,
            },
          },
          {
            path: 'full',
            component: ThemedFullItemPageComponent,
            data: {
              menuRoute: MenuRoute.FULL_ITEM_PAGE,
            },
          },
          {
            path: ITEM_EDIT_PATH,
            loadChildren: () => import('./edit-item-page/edit-item-page.module')
              .then((m) => m.EditItemPageModule),
          },
          {
            path: UPLOAD_BITSTREAM_PATH,
            component: UploadBitstreamComponent,
            canActivate: [AuthenticatedGuard]
          },
          {
            path: REQUEST_COPY_MODULE_PATH,
            component: BitstreamRequestACopyPageComponent,
          },
          {
            path: ORCID_PATH,
            component: OrcidPageComponent,
            canActivate: [AuthenticatedGuard, OrcidPageGuard]
          }
        ],
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
          }
        ],
      }
    ])
  ],
  providers: [
    ItemPageResolver,
    ItemBreadcrumbResolver,
    DSOBreadcrumbsService,
    LinkService,
    ItemPageAdministratorGuard,
    VersionResolver,
    OrcidPageGuard
  ]

})
export class ItemPageRoutingModule {

}
