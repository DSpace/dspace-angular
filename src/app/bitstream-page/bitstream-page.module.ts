import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { EditBitstreamPageComponent } from './edit-bitstream-page/edit-bitstream-page.component';
import { BitstreamPageRoutingModule } from './bitstream-page-routing.module';
import { BitstreamAuthorizationsComponent } from './bitstream-authorizations/bitstream-authorizations.component';
import { FormModule } from '../shared/form/form.module';
import { ResourcePoliciesModule } from '../shared/resource-policies/resource-policies.module';
import { BitstreamDownloadPageComponent } from './bitstream-download-page/bitstream-download-page.component';
import { AnnotationUploadComponent } from './edit-bitstream-page/annotation-upload/annotation-upload.component';
import { UploadModule } from '../shared/upload/upload.module';
import { AnnotationComponent } from './edit-bitstream-page/annotation/annotation.component';

/**
 * This module handles all components that are necessary for Bitstream related pages
 */
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BitstreamPageRoutingModule,
    FormModule,
    ResourcePoliciesModule,
    UploadModule
  ],
  declarations: [
    BitstreamAuthorizationsComponent,
    EditBitstreamPageComponent,
    BitstreamDownloadPageComponent,
    AnnotationComponent,
    AnnotationUploadComponent
  ]
})
export class BitstreamPageModule {
}
