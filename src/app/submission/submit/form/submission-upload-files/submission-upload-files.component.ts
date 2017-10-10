import { Component, Input } from '@angular/core';
import { BitstreamService } from '../../../panel/bitstream/bitstream.service';

@Component({
  selector: 'ds-submission-upload-files',
  templateUrl: './submission-upload-files.component.html',
})
export class SubmissionUploadFilesComponent {

  @Input() submissionId;

  protected subscriptions = [];

  constructor(private bitstreamService: BitstreamService) {}

  public onCompleteItem(itemData) {
    this.bitstreamService.setNewBitstream(
      this.submissionId,
      itemData.md5,
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
  /*ngOnInit() {

  }

  **
   * Method provided by Angular. Invoked when the instance is destroyed.
   *
  ngOnDestroy() {
    this.subscriptions
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }*/
}
