import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { EditBitstreamPageComponent } from './edit-bitstream-page/edit-bitstream-page.component';
import { BitstreamPageRoutingModule } from './bitstream-page-routing.module';

/**
 * This module handles all components that are necessary for Bitstream related pages
 */
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BitstreamPageRoutingModule
  ],
  declarations: [
    EditBitstreamPageComponent
  ]
})
export class BitstreamPageModule {
}
