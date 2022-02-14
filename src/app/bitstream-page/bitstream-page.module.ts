import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { EditBitstreamPageComponent } from './edit-bitstream-page/edit-bitstream-page.component';
import { BitstreamPageRoutingModule } from './bitstream-page-routing.module';
import { BitstreamAuthorizationsComponent } from './bitstream-authorizations/bitstream-authorizations.component';
import { FormModule } from '../shared/form/form.module';
import { ResourcePoliciesModule } from '../shared/resource-policies/resource-policies.module';

/**
 * This module handles all components that are necessary for Bitstream related pages
 */
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BitstreamPageRoutingModule,
    FormModule,
    ResourcePoliciesModule
  ],
  declarations: [
    BitstreamAuthorizationsComponent,
    EditBitstreamPageComponent
  ]
})
export class BitstreamPageModule {
}
