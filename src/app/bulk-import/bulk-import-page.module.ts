import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BulkImportGuard } from './bulk-import.guard';
import { BulkImportPageRoutingModule } from './bulk-import-page.routing.module';

/**
 * The module related to the bulk import.
 */
@NgModule({
  imports: [
    CommonModule,
    BulkImportPageRoutingModule,
  ],
  declarations: [
  ],
  providers: [
    BulkImportGuard,
  ],
})
export class BulkImportPageModule {

}
