import { Component, Input, OnChanges } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { Observable, of as observableOf } from 'rxjs';
import { first } from 'rxjs/operators';

import { SectionsService } from '../../sections/sections.service';
import { hasValue, isEmpty, isNotEmpty } from '../../../shared/empty.util';
import { Workspaceitem } from '../../../core/submission/models/workspaceitem.model';
import { normalizeSectionData } from '../../../core/submission/models/workspaceitem-sections.model';
import { SubmissionService } from '../../submission.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { UploaderOptions } from '../../../shared/uploader/uploader-options.model';
import parseSectionErrors from '../../utils/parseSectionErrors';
import { SubmissionJsonPatchOperationsService } from '../../../core/submission/submission-json-patch-operations.service';

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
  private uploadEnabled: Observable<boolean> = observableOf(false);

  public onBeforeUpload = () => {
    this.operationsService.jsonPatchByResourceType(
      this.submissionService.getSubmissionObjectLinkName(),
      this.submissionId,
      'sections')
      .subscribe();
  };

  constructor(private notificationsService: NotificationsService,
              private operationsService: SubmissionJsonPatchOperationsService,
              private sectionService: SectionsService,
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
        .pipe(first())
        .subscribe((isUploadEnabled) => {
          if (isUploadEnabled) {

            const {sections} = workspaceitem;
            const {errors} = workspaceitem;

            const errorsList = parseSectionErrors(errors);
            if (sections && isNotEmpty(sections)) {
              Object.keys(sections)
                .forEach((sectionId) => {
                  const sectionData = normalizeSectionData(sections[sectionId]);
                  const sectionErrors = errorsList[sectionId];
                  if (sectionId === 'upload') {
                    // Look for errors on upload
                    if ((isEmpty(sectionErrors))) {
                      this.notificationsService.success(null, this.translate.get('submission.sections.upload.upload-successful'));
                    } else {
                      this.notificationsService.error(null, this.translate.get('submission.sections.upload.upload-failed'));
                    }
                  }
                  this.sectionService.updateSectionData(this.submissionId, sectionId, sectionData, sectionErrors)
                })
            }

          }
        })
    );
  }

  public onUploadError() {
    this.notificationsService.error(null, this.translate.get('submission.sections.upload.upload-failed'));
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
