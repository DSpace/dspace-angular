import { Component, Input, OnChanges } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { SectionService } from '../../section/section.service';
import { hasValue, isNotEmpty } from '../../../shared/empty.util';
import { Workspaceitem } from '../../../core/submission/models/workspaceitem.model';
import { normalizeSectionData } from '../../../core/submission/models/workspaceitem-sections.model';
import { JsonPatchOperationsService } from '../../../core/json-patch/json-patch-operations.service';
import { SubmitDataResponseDefinitionObject } from '../../../core/shared/submit-data-response-definition.model';
import { SubmissionService } from '../../submission.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { UploaderOptions } from '../../../shared/uploader/uploader-options.model';

@Component({
  selector: 'ds-submission-upload-files',
  templateUrl: './submission-upload-files.component.html',
})
export class SubmissionUploadFilesComponent implements OnChanges {

  @Input() collectionId;
  @Input() submissionId;
  @Input() sectionId;
  @Input() uploadFilesOptions: UploaderOptions;

  public enableDragOverDocument = true;
  public dropOverDocumentMsg = 'submission.sections.upload.drop-message';
  public dropMsg = 'submission.sections.upload.drop-message';

  private subs = [];
  private uploadEnabled: Observable<boolean> = Observable.of(false);

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
    this.uploadEnabled = this.sectionService.isSectionAvailable(this.submissionId, this.sectionId);
  }

  public onCompleteItem(workspaceitem: Workspaceitem) {
    // Checks if upload section is enabled so do upload
    this.subs.push(
      this.uploadEnabled
        .subscribe((isUploadEnabled) => {
          if (isUploadEnabled) {
            this.notificationsService.success(null, this.translate.get('submission.sections.upload.upload-successful'));

            const {sections} = workspaceitem;
            if (sections && isNotEmpty(sections)) {
              Object.keys(sections)
                .forEach((sectionId) => {
                  const sectionData = normalizeSectionData(sections[sectionId]);
                  this.sectionService.updateSectionData(this.submissionId, sectionId, sectionData)
                })
            }
          }
        })
    );
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
