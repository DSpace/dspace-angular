import { CrisItemPageRoutingModule } from './cris-item-page-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { CrisItemPageComponent } from './cris-item-page.component';
import { CrisLayoutModule } from '../cris-layout/cris-layout.module';
import { StatisticsModule } from '../statistics/statistics.module';

@NgModule({
  declarations: [
    CrisItemPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CrisLayoutModule,
    StatisticsModule,
    CrisItemPageRoutingModule
  ],
  exports: [
    CrisItemPageComponent
  ]
})
export class CrisItemPageModule { }
