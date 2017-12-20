import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { SectionService } from '../../section/section.service';
import { SectionUploadService } from '../../section/upload/section-upload.service';
import { UploadFilesComponentOptions } from '../../../shared/upload-files/upload-files-component-options.model';
import { hasValue, isNotEmpty, isNotUndefined } from '../../../shared/empty.util';
import { WorkspaceitemSectionUploadFileObject } from '../../models/workspaceitem-section-upload-file.model';
import { SubmissionRestService } from '../../submission-rest.service';
import { WorkspaceitemObject } from '../../models/workspaceitem.model';

@Component({
  selector: 'ds-submission-upload-files',
  templateUrl: './submission-upload-files.component.html',
})
export class SubmissionUploadFilesComponent implements OnChanges {

  @Input() collectionId;
  @Input() submissionId;
  @Input() definitionId;
  @Input() sectionId;
  @Input() uploadFilesOptions:UploadFilesComponentOptions;

  private subs = [];
  private uploadEnabled: boolean;

  onBeforeUpload = () => {
    this.submissionRestService.jsonPatchByResourceType(this.submissionId, 'sections')
      .subscribe((state) => console.log('before upload', state));
  };

  constructor(private sectionUploadService: SectionUploadService,
              private sectionService: SectionService,
              private submissionRestService: SubmissionRestService,) { }

  ngOnChanges() {
    this.uploadEnabled = false;
    if (this.definitionId && this.sectionId) {
      // Checks if upload section is present in the form definition
      this.subs.push(this.sectionService.getSectionDefinition(this.definitionId, this.sectionId)
        .filter((state) => isNotUndefined(state))
        .take(1)
        .subscribe((state) => {
          this.uploadEnabled = true;
      }));
    }
  }

  public onCompleteItem(workspaceitem: WorkspaceitemObject) {
    // Checks if upload section is enabled so do upload
    if (this.uploadEnabled) {
      this.subs.push(
        this.sectionService.isSectionLoaded(this.submissionId, this.sectionId)
          .subscribe((isSectionLoaded) => {
            // Whether upload section is not yet loaded add it
            if (!isSectionLoaded) {
              this.sectionService.addSection(this.collectionId, this.submissionId, this.definitionId, this.sectionId)
            }
            const { sections } = workspaceitem;
            if (sections && isNotEmpty(sections)) {
              Object.keys(sections)
                .forEach((sectionId) => this.sectionService.updateSectionData(this.submissionId, sectionId, sections[sectionId]))
            }
            /*this.sectionUploadService.addUploadedFile(
              this.submissionId,
              this.sectionId,
              workspaceitemData.uuid,
              workspaceitemData
            )*/
          })
      );
    }
  }

  /**
   * Method provided by Angular. Invoked when the instance is destroyed.
   */
  ngOnDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}
