import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormModule } from '../../../shared/form/form.module';
import { SharedModule } from '../../../shared/shared.module';
import { AddBitstreamFormatComponent } from './add-bitstream-format/add-bitstream-format.component';
import { BitstreamFormatsComponent } from './bitstream-formats.component';
import { BitstreamFormatsRoutingModule } from './bitstream-formats-routing.module';
import { EditBitstreamFormatComponent } from './edit-bitstream-format/edit-bitstream-format.component';
import { FormatFormComponent } from './format-form/format-form.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    BitstreamFormatsRoutingModule,
    FormModule,
  ],
  declarations: [
    BitstreamFormatsComponent,
    EditBitstreamFormatComponent,
    AddBitstreamFormatComponent,
    FormatFormComponent,
  ],
})
export class BitstreamFormatsModule {

}
