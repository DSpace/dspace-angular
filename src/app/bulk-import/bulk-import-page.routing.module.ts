import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { BulkImportGuard } from './bulk-import.guard';
import { BulkImportPageComponent } from './bulk-import-page.component';
import { BulkImportPageResolver } from './bulk-import-page.resolver';

/**
 * RouterModule to help navigate to the page with the bulk import.
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        component: BulkImportPageComponent,
        resolve: {
          collection: BulkImportPageResolver,
          breadcrumb: I18nBreadcrumbResolver,
        },
        pathMatch: 'full',
        data: { title: 'bulk-import.title', breadcrumbKey: 'bulk-import' },
        canActivate: [BulkImportGuard],
      },
    ]),
  ],
  providers: [
    BulkImportPageResolver,
  ],
})
export class BulkImportPageRoutingModule {

}
