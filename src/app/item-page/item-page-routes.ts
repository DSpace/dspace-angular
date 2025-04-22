import { Route } from '@angular/router';

import { REQUEST_COPY_MODULE_PATH } from '../app-routing-paths';
import { accessTokenResolver } from '../core/auth/access-token.resolver';
import { authenticatedGuard } from '../core/auth/authenticated.guard';
import { itemBreadcrumbResolver } from '../core/breadcrumbs/item-breadcrumb.resolver';
import { MenuRoute } from '../shared/menu/menu-route.model';
import { viewTrackerResolver } from '../statistics/angulartics/dspace/view-tracker.resolver';
import { BitstreamRequestACopyPageComponent } from './bitstreams/request-a-copy/bitstream-request-a-copy-page.component';
import { UploadBitstreamComponent } from './bitstreams/upload/upload-bitstream.component';
import { ThemedFullItemPageComponent } from './full/themed-full-item-page.component';
import { itemPageResolver } from './item-page.resolver';
import {
  ITEM_ACCESS_BY_TOKEN_PATH,
  ITEM_EDIT_PATH,
  ORCID_PATH,
  UPLOAD_BITSTREAM_PATH,
} from './item-page-routing-paths';
import { OrcidPageComponent } from './orcid-page/orcid-page.component';
import { orcidPageGuard } from './orcid-page/orcid-page.guard';
import { ThemedItemPageComponent } from './simple/themed-item-page.component';
import { versionResolver } from './version-page/version.resolver';
import { VersionPageComponent } from './version-page/version-page/version-page.component';

export const ROUTES: Route[] = [
  {
    path: ':id',
    resolve: {
      dso: itemPageResolver,
      itemRequest: accessTokenResolver,
      breadcrumb: itemBreadcrumbResolver,
    },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        component: ThemedItemPageComponent,
        pathMatch: 'full',
        data: {
          menuRoute: MenuRoute.ITEM_PAGE,
        },
        resolve: {
          tracking: viewTrackerResolver,
        },
      },
      {
        path: 'full',
        component: ThemedFullItemPageComponent,
        data: {
          menuRoute: MenuRoute.ITEM_PAGE,
        },
        resolve: {
          tracking: viewTrackerResolver,
        },
      },
      {
        path: ITEM_EDIT_PATH,
        loadChildren: () => import('./edit-item-page/edit-item-page-routes')
          .then((m) => m.ROUTES),
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
        path: ITEM_ACCESS_BY_TOKEN_PATH,
        component: ThemedFullItemPageComponent,
        resolve: {
          menu: accessTokenResolver,
        },
      },
    ],
  },
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
];
