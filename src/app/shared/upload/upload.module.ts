/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload';

import { FileDropzoneNoUploaderComponent } from './file-dropzone-no-uploader/file-dropzone-no-uploader.component';
import { UploaderComponent } from './uploader/uploader.component';

const COMPONENTS = [
  UploaderComponent,
  FileDropzoneNoUploaderComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
    ...COMPONENTS,
  ],
  providers: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
    FileUploadModule,
  ],
})
export class UploadModule {
}
