import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BitstreamFormatsComponent } from './bitstream-formats.component';
import { FormatFormComponent } from './format-form/format-form.component';
import { EditBitstreamFormatComponent } from './edit-bitstream-format/edit-bitstream-format.component';
import { BitstreamFormatsRoutingModule } from './bitstream-formats-routing.module';
import { AddBitstreamFormatComponent } from './add-bitstream-format/add-bitstream-format.component';
import { FormModule } from '../../../shared/form/form.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        BitstreamFormatsRoutingModule,
        FormModule,
        BitstreamFormatsComponent,
        EditBitstreamFormatComponent,
        AddBitstreamFormatComponent,
        FormatFormComponent
    ]
})
export class BitstreamFormatsModule {

}
