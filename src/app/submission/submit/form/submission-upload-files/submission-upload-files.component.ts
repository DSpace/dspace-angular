import { Component, Input } from '@angular/core';
import { BitstreamService } from '../../../panel/bitstream/bitstream.service';
import { UploadFilesComponentOptions } from '../../../../shared/upload-files/upload-files-component-options.model';

@Component({
  selector: 'ds-submission-upload-files',
  templateUrl: './submission-upload-files.component.html',
})
export class SubmissionUploadFilesComponent {

  @Input() submissionId;

  public uploadFilesOptions:UploadFilesComponentOptions;

  constructor(private bitstreamService: BitstreamService) {
    this.uploadFilesOptions = {
      url: 'http://ng-file-upload-php-demo.dev01.4science.it/server.php',
      authToken: null,
      disableMultipart: false,
      itemAlias: null
    }
  }

  public onCompleteItem(itemData) {
    this.bitstreamService.setNewBitstream(
      this.submissionId,
      itemData.uuid,
      {
        name: itemData.originalName,
        title: '',
        description: '',
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
