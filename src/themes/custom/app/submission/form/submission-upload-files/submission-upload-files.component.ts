import { Component } from '@angular/core';

import { UploaderComponent } from '../../../../../../app/shared/upload/uploader/uploader.component';
import { SubmissionUploadFilesComponent as BaseComponent } from '../../../../../../app/submission/form/submission-upload-files/submission-upload-files.component';

@Component({
  selector: 'ds-themed-submission-upload-files',
  // templateUrl: './submission-upload-files.component.html',
  templateUrl: '../../../../../../app/submission/form/submission-upload-files/submission-upload-files.component.html',
  imports: [
    UploaderComponent,
  ],
  standalone: true,
})
export class SubmissionUploadFilesComponent extends BaseComponent {
}
