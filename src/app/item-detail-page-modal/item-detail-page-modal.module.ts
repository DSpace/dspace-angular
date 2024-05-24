import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CrisLayoutModule } from '../cris-layout/cris-layout.module';
import { ItemDetailPageModalComponent } from './item-detail-page-modal.component';


@NgModule({
  imports: [
    CommonModule,
    CrisLayoutModule,
    TranslateModule,
  ],
  declarations: [ItemDetailPageModalComponent],
  exports: [ItemDetailPageModalComponent],
  entryComponents: [ItemDetailPageModalComponent],
})

/**
 * This module handles all components and pipes that are necessary for the search page
 */
export class ItemDetailPageModalModule {
}
