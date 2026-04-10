import { Route } from '@angular/router';

import { authenticatedGuard } from '../core/auth/authenticated.guard';
import { bitstreamBreadcrumbResolver } from '../core/breadcrumbs/bitstream-breadcrumb.resolver';
import { i18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ResourcePolicyCreateComponent } from '../shared/resource-policies/create/resource-policy-create.component';
import { ResourcePolicyEditComponent } from '../shared/resource-policies/edit/resource-policy-edit.component';
import { resourcePolicyResolver } from '../shared/resource-policies/resolvers/resource-policy.resolver';
import { resourcePolicyTargetResolver } from '../shared/resource-policies/resolvers/resource-policy-target.resolver';
import { BitstreamAuthorizationsComponent } from './bitstream-authorizations/bitstream-authorizations.component';
import { BitstreamDownloadPageComponent } from './bitstream-download-page/bitstream-download-page.component';
import { bitstreamPageResolver } from './bitstream-page.resolver';
import { bitstreamPageAuthorizationsGuard } from './bitstream-page-authorizations.guard';
import { ThemedEditBitstreamPageComponent } from './edit-bitstream-page/themed-edit-bitstream-page.component';
import { legacyBitstreamURLRedirectGuard } from './legacy-bitstream-url-redirect.guard';

const EDIT_BITSTREAM_PATH = ':id/edit';
const EDIT_BITSTREAM_AUTHORIZATIONS_PATH = ':id/authorizations';

/**
 * Routing module to help navigate Bitstream pages
 */
export const ROUTES: Route[] = [
  {
    // Resolve XMLUI bitstream download URLs
    path: 'handle/:prefix/:suffix/:filename',
    component: BitstreamDownloadPageComponent,
    canActivate: [legacyBitstreamURLRedirectGuard],
  },
  {
    // Resolve JSPUI bitstream download URLs
    path: ':prefix/:suffix/:sequence_id/:filename',
    component: BitstreamDownloadPageComponent,
    canActivate: [legacyBitstreamURLRedirectGuard],
  },
  {
    // Resolve angular bitstream download URLs
    path: ':id/download',
    component: BitstreamDownloadPageComponent,
    resolve: {
      bitstream: bitstreamPageResolver,
    },
  },
  {
    path: EDIT_BITSTREAM_PATH,
    component: ThemedEditBitstreamPageComponent,
    resolve: {
      bitstream: bitstreamPageResolver,
      breadcrumb: bitstreamBreadcrumbResolver,
    },
    canActivate: [authenticatedGuard],
  },
  {
    path: EDIT_BITSTREAM_AUTHORIZATIONS_PATH,
    canActivate: [bitstreamPageAuthorizationsGuard],
    children: [
      {
        path: 'create',
        resolve: {
          resourcePolicyTarget: resourcePolicyTargetResolver,
        },
        component: ResourcePolicyCreateComponent,
        data: { title: 'resource-policies.create.page.title', showBreadcrumbs: true },
      },
      {
        path: 'edit',
        resolve: {
          breadcrumb: i18nBreadcrumbResolver,
          resourcePolicy: resourcePolicyResolver,
        },
        component: ResourcePolicyEditComponent,
        data: { breadcrumbKey: 'item.edit', title: 'resource-policies.edit.page.title', showBreadcrumbs: true },
      },
      {
        path: '',
        resolve: {
          bitstream: bitstreamPageResolver,
          breadcrumb: bitstreamBreadcrumbResolver,
        },
        component: BitstreamAuthorizationsComponent,
        data: { title: 'bitstream.edit.authorizations.title', showBreadcrumbs: true },
      },
    ],
  },
];
