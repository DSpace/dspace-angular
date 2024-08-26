import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CrisLayoutModule } from '../cris-layout/cris-layout.module';


@NgModule({
  imports: [
    CommonModule,
    CrisLayoutModule,
    TranslateModule,
  ],
  declarations: [],
  exports: [],
})

/**
 * This module handles all components and pipes that are necessary for the search page
 */
export class ItemDetailPageModalModule {
}
