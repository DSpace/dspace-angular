import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FileDownloadButtonComponent } from './types/file-download-button/file-download-button.component';

const COMPONENTS = [
  FileDownloadButtonComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [...COMPONENTS],
})
export class AttachmentRenderingModule {
}
