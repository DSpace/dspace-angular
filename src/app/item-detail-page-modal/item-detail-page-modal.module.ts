import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDetailPageModalComponent } from './item-detail-page-modal.component';
import { CrisLayoutModule } from '../cris-layout/cris-layout.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    imports: [
        CommonModule,
        CrisLayoutModule,
        TranslateModule,
    ],
    declarations: [ItemDetailPageModalComponent],
    exports: [ItemDetailPageModalComponent],
    entryComponents: [ItemDetailPageModalComponent]
})

/**
 * This module handles all components and pipes that are necessary for the search page
 */
export class ItemDetailPageModalModule {
}
