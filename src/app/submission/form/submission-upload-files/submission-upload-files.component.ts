import { Component, Input, OnChanges } from '@angular/core';
import { SectionService } from '../../section/section.service';
import { UploadFilesComponentOptions } from '../../../shared/upload-files/upload-files-component-options.model';
import { hasValue, isNotEmpty, isNotUndefined } from '../../../shared/empty.util';
import { Workspaceitem } from '../../../core/submission/models/workspaceitem.model';
import { normalizeSectionData } from '../../../core/submission/models/workspaceitem-sections.model';
import { JsonPatchOperationsService } from '../../../core/json-patch/json-patch-operations.service';
import { SubmitDataResponseDefinitionObject } from '../../../core/shared/submit-data-response-definition.model';
import { SubmissionService } from '../../submission.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationOptions } from '../../../shared/notifications/models/notification-options.model';

@Component({
  selector: 'ds-submission-upload-files',
  templateUrl: './submission-upload-files.component.html',
})
export class SubmissionUploadFilesComponent implements OnChanges {

  @Input() collectionId;
  @Input() submissionId;
  @Input() definitionId;
  @Input() sectionId;
  @Input() uploadFilesOptions: UploadFilesComponentOptions;

  public enableDragOverDocument = true;
  public dropOverDocumentMsg = 'submission.section.upload.drop-message';
  public dropMsg = 'submission.section.upload.drop-message';

  private subs = [];
  private uploadEnabled: boolean;

  public onBeforeUpload = () => {
    this.operationsService.jsonPatchByResourceType(
      this.submissionService.getSubmissionObjectLinkName(),
      this.submissionId,
      'sections')
      .subscribe();
  };

  constructor(private notificationsService: NotificationsService,
              private operationsService: JsonPatchOperationsService<SubmitDataResponseDefinitionObject>,
              private sectionService: SectionService,
              private submissionService: SubmissionService,
              private translate: TranslateService) {
  }

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

  public onCompleteItem(workspaceitem: Workspaceitem) {
    // Checks if upload section is enabled so do upload
    if (this.uploadEnabled) {
      this.subs.push(
        this.sectionService.isSectionLoaded(this.submissionId, this.sectionId)
          .subscribe((isSectionLoaded) => {
            this.notificationsService.success(null, this.translate.get('submission.section.upload.upload_successful'));

            // Whether upload section is not yet loaded add it
            if (!isSectionLoaded) {
              this.sectionService.addSection(this.collectionId, this.submissionId, this.definitionId, this.sectionId)
            }
            const {sections} = workspaceitem;
            if (sections && isNotEmpty(sections)) {
              this.notificationsService.info(null, this.translate.get('submission.section.general.metadata_extracted'));
              Object.keys(sections)
                .forEach((sectionId) => {
                  const sectionData = normalizeSectionData(sections[sectionId]);
                  this.sectionService.updateSectionData(this.submissionId, sectionId, sectionData)
                })
            }
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
