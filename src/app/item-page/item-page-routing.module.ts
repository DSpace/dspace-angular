import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemPageResolver } from './item-page.resolver';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ItemBreadcrumbResolver } from '../core/breadcrumbs/item-breadcrumb.resolver';
import { VersionResolver } from './version-page/version.resolver';
import { DSOBreadcrumbsService } from '../core/breadcrumbs/dso-breadcrumbs.service';
import { LinkService } from '../core/cache/builders/link.service';
import { UploadBitstreamComponent } from './bitstreams/upload/upload-bitstream.component';
import { ITEM_EDIT_PATH, ORCID_PATH, UPLOAD_BITSTREAM_PATH } from './item-page-routing-paths';
import { ItemPageAdministratorGuard } from './item-page-administrator.guard';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { ThemedItemPageComponent } from './simple/themed-item-page.component';
import { ThemedFullItemPageComponent } from './full/themed-full-item-page.component';
import { MenuItemType } from '../shared/menu/menu-item-type.model';
import { VersionPageComponent } from './version-page/version-page/version-page.component';
import { BitstreamRequestACopyPageComponent } from './bitstreams/request-a-copy/bitstream-request-a-copy-page.component';
import { REQUEST_COPY_MODULE_PATH } from '../app-routing-paths';
import { CrisItemPageTabResolver } from './cris-item-page-tab.resolver';
import { OrcidPageComponent } from './orcid-page/orcid-page.component';
import { OrcidPageGuard } from './orcid-page/orcid-page.guard';
import { signpostingLinksResolver } from './simple/link-resolver/signposting-links.resolver';


@NgModule({
  imports: [
    RouterModule.forChild([
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
      },
      {
        path: ':id',
        resolve: {
          dso: ItemPageResolver,
          breadcrumb: ItemBreadcrumbResolver,
          links: signpostingLinksResolver,
        },
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: '',
            component: ThemedItemPageComponent,
            pathMatch: 'full',
            resolve: {
              tabs: CrisItemPageTabResolver
            }
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
          },
          {
            path: REQUEST_COPY_MODULE_PATH,
            component: BitstreamRequestACopyPageComponent,
          },
          {
            path: ORCID_PATH,
            component: OrcidPageComponent,
            canActivate: [AuthenticatedGuard, OrcidPageGuard]
          },
          {
            path: ':tab',
            component: ThemedItemPageComponent,
            resolve: {
              tabs: CrisItemPageTabResolver
            },
          }
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
          showSocialButtons: true
        },
      },

    ])
  ],
  providers: [
    ItemPageResolver,
    ItemBreadcrumbResolver,
    DSOBreadcrumbsService,
    LinkService,
    ItemPageAdministratorGuard,
    VersionResolver,
    OrcidPageGuard,
    CrisItemPageTabResolver
  ]

})
export class ItemPageRoutingModule {

}
