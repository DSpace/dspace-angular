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
            // Matteo - remove comment after Digi change the FORM init process
            // this.sectionService.addSection(this.collectionId, this.submissionId, this.definitionId, this.sectionId)
          }
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
