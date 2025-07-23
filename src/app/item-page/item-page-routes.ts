import { Route } from '@angular/router';

import { REQUEST_COPY_MODULE_PATH } from '../app-routing-paths';
import { authenticatedGuard } from '../core/auth/authenticated.guard';
import { itemBreadcrumbResolver } from '../core/breadcrumbs/item-breadcrumb.resolver';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { MenuItemType } from '../shared/menu/menu-item-type.model';
import { viewTrackerResolver } from '../statistics/angulartics/dspace/view-tracker.resolver';
import { BitstreamRequestACopyPageComponent } from './bitstreams/request-a-copy/bitstream-request-a-copy-page.component';
import { UploadBitstreamComponent } from './bitstreams/upload/upload-bitstream.component';
import { crisItemPageTabResolver } from './cris-item-page-tab.resolver';
import { ThemedFullItemPageComponent } from './full/themed-full-item-page.component';
import { itemPageResolver } from './item-page.resolver';
import { itemPageAdministratorGuard } from './item-page-administrator.guard';
import {
  ITEM_EDIT_PATH,
  ORCID_PATH,
  UPLOAD_BITSTREAM_PATH,
} from './item-page-routing-paths';
import { OrcidPageComponent } from './orcid-page/orcid-page.component';
import { orcidPageGuard } from './orcid-page/orcid-page.guard';
import { signpostingLinksResolver } from './simple/link-resolver/signposting-links.resolver';
import { ThemedItemPageComponent } from './simple/themed-item-page.component';
import { versionResolver } from './version-page/version.resolver';
import { VersionPageComponent } from './version-page/version-page/version-page.component';

export const ROUTES: Route[] = [
  {
    path: 'version',
    children: [
      {
        path: ':id',
        component: VersionPageComponent,
        resolve: {
          dso: versionResolver,
        },
      },
    ],
  },
  {
    path: ':id',
    resolve: {
      dso: itemPageResolver,
      breadcrumb: itemBreadcrumbResolver,
      links: signpostingLinksResolver,
    },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        component: ThemedItemPageComponent,
        pathMatch: 'full',
        resolve: {
          tabs: crisItemPageTabResolver,
          tracking: viewTrackerResolver,
        },
      },
      {
        path: 'full',
        component: ThemedFullItemPageComponent,
        resolve: {
          tracking: viewTrackerResolver,
        },
      },
      {
        path: ITEM_EDIT_PATH,
        loadChildren: () => import('./edit-item-page/edit-item-page-routes')
          .then((m) => m.ROUTES),
        canActivate: [itemPageAdministratorGuard],
      },
      {
        path: UPLOAD_BITSTREAM_PATH,
        component: UploadBitstreamComponent,
        canActivate: [authenticatedGuard],
      },
      {
        path: REQUEST_COPY_MODULE_PATH,
        component: BitstreamRequestACopyPageComponent,
      },
      {
        path: ORCID_PATH,
        component: OrcidPageComponent,
        canActivate: [authenticatedGuard, orcidPageGuard],
      },
      {
        path: ':tab',
        component: ThemedItemPageComponent,
        resolve: {
          tabs: crisItemPageTabResolver,
        },
      },
    ],
    data: {
      menu: {
        public: [{
          id: 'statistics_item_:id',
          active: true,
          visible: true,
          parentID: 'statistics',
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

];
