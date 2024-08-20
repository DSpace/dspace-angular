import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CrisLayoutModule } from '../cris-layout/cris-layout.module';
import { CrisItemPageComponent } from './cris-item-page.component';

@NgModule({
  declarations: [
    CrisItemPageComponent,
  ],
  imports: [
    CommonModule,
    CrisLayoutModule,
  ],
  exports: [
    CrisItemPageComponent,
  ],
})
export class CrisItemPageModule { }
