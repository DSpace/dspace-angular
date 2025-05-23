import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SubmissionSectionUploadFileComponent as BaseComponent } from 'src/app/submission/sections/upload/file/section-upload-file.component';

import { BtnDisabledDirective } from '../../../../../../../app/shared/btn-disabled.directive';
import { ThemedFileDownloadLinkComponent } from '../../../../../../../app/shared/file-download-link/themed-file-download-link.component';
import { SubmissionSectionUploadFileViewComponent } from '../../../../../../../app/submission/sections/upload/file/view/section-upload-file-view.component';

@Component({
  selector: 'ds-themed-submission-upload-section-file',
  // styleUrls: ['./section-upload-file.component.scss'],
  styleUrls: ['../../../../../../../app/submission/sections/upload/file/section-upload-file.component.scss'],
  // templateUrl: './section-upload-file.component.html'
  templateUrl: '../../../../../../../app/submission/sections/upload/file/section-upload-file.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    SubmissionSectionUploadFileViewComponent,
    ThemedFileDownloadLinkComponent,
    TranslateModule,
  ],
})
export class SubmissionSectionUploadFileComponent extends BaseComponent {
}
