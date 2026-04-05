import { Route } from '@angular/router';
import { accessTokenResolver } from '@dspace/core/auth/access-token.resolver';
import { authenticatedGuard } from '@dspace/core/auth/authenticated.guard';
import { i18nBreadcrumbResolver } from '@dspace/core/breadcrumbs/i18n-breadcrumb.resolver';
import { itemBreadcrumbResolver } from '@dspace/core/breadcrumbs/item-breadcrumb.resolver';

import { REQUEST_COPY_MODULE_PATH } from '../app-routing-paths';
import { ObjectAuditLogsComponent } from '../audit-page/object-audit-overview/object-audit-logs.component';
import { MenuRoute } from '../shared/menu/menu-route.model';
import { viewTrackerResolver } from '../statistics/angulartics/dspace/view-tracker.resolver';
import { BitstreamRequestACopyPageComponent } from './bitstreams/request-a-copy/bitstream-request-a-copy-page.component';
import { UploadBitstreamComponent } from './bitstreams/upload/upload-bitstream.component';
import { ThemedFullItemPageComponent } from './full/themed-full-item-page.component';
import { itemPageResolver } from './item-page.resolver';
import {
  ITEM_ACCESS_BY_TOKEN_PATH,
  ITEM_AUDIT_LOGS_PATH,
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
    data: {
      showSocialButtons: true,
    },
    resolve: {
      dso: itemPageResolver,
      itemRequest: accessTokenResolver,
      breadcrumb: itemBreadcrumbResolver,
      links: signpostingLinksResolver,
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
        path: ITEM_AUDIT_LOGS_PATH,
        component: ObjectAuditLogsComponent,
        data: { title: 'audit.object.title', breadcrumbKey: 'audit.object' },
        resolve: {
          breadcrumb: i18nBreadcrumbResolver,
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
];
