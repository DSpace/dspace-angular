import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SubmissionSectionUploadFileComponent as BaseComponent } from 'src/app/submission/sections/upload/file/section-upload-file.component';

import { ThemedFileDownloadLinkComponent } from '../../../../../../../app/shared/file-download-link/themed-file-download-link.component';
import { FileSizePipe } from '../../../../../../../app/shared/utils/file-size-pipe';
import { SubmissionSectionUploadFileViewComponent } from '../../../../../../../app/submission/sections/upload/file/view/section-upload-file-view.component';

/**
 * This component represents a single bitstream contained in the submission
 */
@Component({
  selector: 'ds-themed-submission-upload-section-file',
  // styleUrls: ['./section-upload-file.component.scss'],
  styleUrls: ['../../../../../../../app/submission/sections/upload/file/section-upload-file.component.scss'],
  // templateUrl: './section-upload-file.component.html'
  templateUrl: '../../../../../../../app/submission/sections/upload/file/section-upload-file.component.html',
  standalone: true,
  imports: [
    TranslateModule,
    SubmissionSectionUploadFileViewComponent,
    NgIf,
    AsyncPipe,
    ThemedFileDownloadLinkComponent,
    FileSizePipe,
  ],
})
export class SubmissionSectionUploadFileComponent
  extends BaseComponent {
}
