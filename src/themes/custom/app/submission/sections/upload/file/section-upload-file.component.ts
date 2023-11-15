import { Component } from '@angular/core';
import {
    SubmissionSectionUploadFileComponent as BaseComponent
} from 'src/app/submission/sections/upload/file/section-upload-file.component';

/**
 * This component represents a single bitstream contained in the submission
 */
@Component({
  selector: 'ds-submission-upload-section-file',
  // styleUrls: ['./section-upload-file.component.scss'],
  styleUrls: ['../../../../../../../app/submission/sections/upload/file/section-upload-file.component.scss'],
  // templateUrl: './section-upload-file.component.html'
  templateUrl: '../../../../../../../app/submission/sections/upload/file/section-upload-file.component.html'
})
export class SubmissionSectionUploadFileComponent
    extends BaseComponent {
}
