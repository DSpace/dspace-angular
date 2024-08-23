import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FileDownloadButtonComponent } from './types/file-download-button/file-download-button.component';
import { RouterLink } from '@angular/router';

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
