import { Component, Input } from '@angular/core';
import { SectionService } from '../../section/section.service';
import { SectionUploadService } from '../../section/upload/section-upload.service';
import { UploadFilesComponentOptions } from '../../../shared/upload-files/upload-files-component-options.model';
import { hasValue } from '../../../shared/empty.util';
import { WorkspaceitemSectionUploadFileObject } from '../../models/workspaceitem-section-upload-file.model';

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

  constructor(private bitstreamService: SectionUploadService,
              private sectionService: SectionService) { }

  public onCompleteItem(itemData: WorkspaceitemSectionUploadFileObject) {
    this.subscriptions.push(
      this.sectionService.isSectionLoaded(this.submissionId, this.sectionId)
        .subscribe((isSectionLoaded) => {
          if (!isSectionLoaded) {
            this.sectionService.addSection(this.collectionId, this.submissionId, this.definitionId, this.sectionId)
          }

          /*const metadatum = [];
          Object.keys((itemData.metadata))
            .forEach((key) => {
              metadatum.push({key: key, value: itemData.metadata[key][0].value})
            });
          */
          this.bitstreamService.setNewBitstream(
            this.submissionId,
            this.sectionId,
            itemData.uuid,
            /*{
              uuid: itemData.uuid,
              metadata: metadatum,
              sizeBytes: itemData.sizeBytes,
              checkSum: {
                checkSumAlgorithm: itemData.checkSum.checkSumAlgorithm,
                value: itemData.checkSum.value,
              },
              url: itemData.url,
              thumbnail: null,
              accessConditions: []
            }*/
            itemData
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
