import { Component, Input } from '@angular/core';
import { BitstreamService } from '../../section/bitstream/bitstream.service';
import { UploadFilesComponentOptions } from '../../../shared/upload-files/upload-files-component-options.model';

@Component({
  selector: 'ds-submission-upload-files',
  templateUrl: './submission-upload-files.component.html',
})
export class SubmissionUploadFilesComponent {

  @Input() submissionId;
  @Input() uploadFilesOptions:UploadFilesComponentOptions;

  constructor(private bitstreamService: BitstreamService) {
  }

  public onCompleteItem(itemData) {
    this.bitstreamService.setNewBitstream(
      this.submissionId,
      itemData.uuid,
      {
        name: itemData.originalName,
        formID: '',
        size: itemData.size,
        hash: itemData.md5,
        thumbnail: null,
        policies: [
          {
            type: 1,
            name: 'Open access',
            date: null,
            availableGroups: []
          }
        ]
      }
    );
  }
}
