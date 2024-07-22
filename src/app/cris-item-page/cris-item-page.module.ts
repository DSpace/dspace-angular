import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CrisLayoutModule } from '../cris-layout/cris-layout.module';
import { ItemSharedModule } from '../item-page/item-shared.module';
import { SharedModule } from '../shared/shared.module';
import { StatisticsModule } from '../statistics/statistics.module';
import { CrisItemPageComponent } from './cris-item-page.component';

@NgModule({
  declarations: [
    CrisItemPageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    CrisLayoutModule,
    StatisticsModule,
    ItemSharedModule,
  ],
  exports: [
    CrisItemPageComponent,
  ],
})
export class CrisItemPageModule { }
