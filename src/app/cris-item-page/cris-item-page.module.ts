import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { CrisItemPageRoutingModule } from './cris-item-page-routing.module';
import { CrisItemPageComponent } from './cris-item-page.component';
import { LayoutModule } from '../layout/layout.module';

@NgModule({
  declarations: [
    CrisItemPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CrisItemPageRoutingModule,
    LayoutModule
  ]
})
export class CrisItemPageModule { }
