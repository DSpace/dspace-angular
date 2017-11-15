import { Component, Input } from '@angular/core';
import { SectionService } from '../../section/section.service';
import { BitstreamService } from '../../section/bitstream/bitstream.service';
import { UploadFilesComponentOptions } from '../../../shared/upload-files/upload-files-component-options.model';
import { hasValue } from '../../../shared/empty.util';

@Component({
  selector: 'ds-submission-upload-files',
  templateUrl: './submission-upload-files.component.html',
})
export class SubmissionUploadFilesComponent {

  @Input() collectionId;
  @Input() submissionId;
  @Input() definitionId;
  @Input() sectionId;
  @Input() uploadFilesOptions:UploadFilesComponentOptions;

  private subscriptions = [];

  constructor(private bitstreamService: BitstreamService,
              private sectionService: SectionService) { }

  public onCompleteItem(itemData) {
    this.subscriptions.push(
      this.sectionService.isSectionLoaded(this.submissionId, this.sectionId)
        .subscribe((isSectionLoaded) => {
          if (!isSectionLoaded) {
            this.sectionService.addSection(this.collectionId, this.submissionId, this.definitionId, this.sectionId)
          }
          this.bitstreamService.setNewBitstream(
            this.submissionId,
            itemData.uuid,
            {
              name: itemData.metadata[0].value,
              title: '',
              description: '',
              size: itemData.sizeBytes,
              hash: itemData.checkSum.value,
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
          )
        })
    );
  }

  /**
   * Method provided by Angular. Invoked when the instance is destroyed.
   */
  ngOnDestroy() {
    this.subscriptions
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}
