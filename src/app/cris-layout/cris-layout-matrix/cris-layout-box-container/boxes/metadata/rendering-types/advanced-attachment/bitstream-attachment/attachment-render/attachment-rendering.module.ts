import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FileDownloadButtonComponent
} from '../../../../../../../../../shared/file-download-button/file-download-button.component';
import { SearchModule } from '../../../../../../../../../shared/search/search.module';
import { SharedModule } from '../../../../../../../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

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
