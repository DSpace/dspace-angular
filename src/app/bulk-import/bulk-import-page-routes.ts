import { Route } from '@angular/router';

import { i18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { bulkImportGuard } from './bulk-import.guard';
import { BulkImportPageComponent } from './bulk-import-page.component';
import { bulkImportPageResolver } from './bulk-import-page.resolver';

/**
 * RouterModule to help navigate to the page with the bulk import.
 */
export const ROUTES: Route[] = [
  {
    path: ':id',
    component: BulkImportPageComponent,
    resolve: {
      collection: bulkImportPageResolver,
      breadcrumb: i18nBreadcrumbResolver,
    },
    pathMatch: 'full',
    data: { title: 'bulk-import.title', breadcrumbKey: 'bulk-import' },
    canActivate: [bulkImportGuard],
  },
];
