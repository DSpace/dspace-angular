import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FileDownloadButtonComponent } from './types/file-download-button/file-download-button.component';

const COMPONENTS = [
  FileDownloadButtonComponent,
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterLink,
    ...COMPONENTS,
  ],
  exports: [...COMPONENTS],
})
export class AttachmentRenderingModule {
}
