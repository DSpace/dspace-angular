import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { FileDownloadButtonComponent } from './types/file-download-button/file-download-button.component';
import { SearchModule } from '../../../../../../../../../shared/search/search.module';
import { SharedModule } from '../../../../../../../../../shared/shared.module';

const COMPONENTS = [
  FileDownloadButtonComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    SearchModule,
    SharedModule,
    TranslateModule
  ],
  exports: [...COMPONENTS]
})
export class AttachmentRenderingModule {
}
