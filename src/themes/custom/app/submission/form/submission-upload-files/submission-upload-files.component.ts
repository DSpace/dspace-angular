import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  first,
  take,
} from 'rxjs/operators';

// Fix the import paths - they should point to the correct locations
import { WorkspaceItem } from '../../../../../../app/core/submission/models/workspaceitem.model';
import { SubmissionJsonPatchOperationsService } from '../../../../../../app/core/submission/submission-json-patch-operations.service';
import { normalizeSectionData } from '../../../../../../app/core/submission/submission-response-parsing.service';
import { hasValue, isEmpty, isNotEmpty } from '../../../../../../app/utils/empty.util';
import { NotificationsService } from '../../../../../../app/core/notification-system/notifications.service';
import { UploaderComponent } from '../../../../../../app/shared/upload/uploader/uploader.component';
import { UploaderOptions } from '../../../../../../app/shared/upload/uploader/uploader-options.model';
import { SectionsService } from '../../../../../../app/submission/sections/sections.service';
import { SectionsType } from '../../../../../../app/core/submission/sections-type';
import { SubmissionService } from '../../../../../../app/submission/submission.service';
import parseSectionErrors from '../../../../../../app/submission/utils/parseSectionErrors';
import { SectionUploadService } from '../../../../../../app/submission/sections/upload/section-upload.service';
import { FilePreviewPanelComponent } from '../../../shared/upload/file-preview-panel/file-preview-panel.component';
import { WorkspaceitemSectionUploadObject } from '../../../../../../app/core/submission/models/workspaceitem-section-upload.model';

@Component({
  selector: 'ds-submission-upload-files',
  templateUrl: './submission-upload-files.component.html',
  styleUrls: ['./submission-upload-files.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    UploaderComponent,
    FilePreviewPanelComponent
  ],
  standalone: true,
})
export class SubmissionUploadFilesComponent implements OnInit, OnChanges, OnDestroy {
  public fileList: any[] = [];
  public selectedFile: any = null;

  @Input() collectionId: string;
  @Input() submissionId: string;
  @Input() uploadFilesOptions: UploaderOptions;

  public enableDragOverDocument = true;
  public dropOverDocumentMsg = 'submission.sections.upload.drop-message';
  public dropMsg = 'submission.sections.upload.drop-message';

  private subs: Subscription[] = [];
  private uploadEnabled: Observable<boolean> = of(false);

  // Use inject() instead of constructor injection for better compatibility
  private notificationsService = inject(NotificationsService);
  private operationsService = inject(SubmissionJsonPatchOperationsService);
  private sectionService = inject(SectionsService);
  private submissionService = inject(SubmissionService);
  private translate = inject(TranslateService);
  private uploadService = inject(SectionUploadService);

  public onBeforeUpload = () => {
    const sub: Subscription = this.operationsService.jsonPatchByResourceType(
      this.submissionService.getSubmissionObjectLinkName(),
      this.submissionId,
      'sections')
      .subscribe();
    this.subs.push(sub);
    return sub;
  };

  ngOnInit() {
    this.subs.push(
      this.uploadService.getUploadedFilesData(this.submissionId, 'upload')
        .subscribe((uploadData: WorkspaceitemSectionUploadObject) => {
          console.log('SubmissionUploadFilesComponent: uploadData', uploadData);
          if (uploadData && uploadData.files) {
            this.fileList = Array.isArray(uploadData.files) ? uploadData.files : Object.values(uploadData.files);
            console.log('SubmissionUploadFilesComponent: fileList', this.fileList);
            if (!this.selectedFile && this.fileList.length > 0) {
              this.selectedFile = this.fileList[0];
            }
          }
        })
    );
  }

  onFileSelectedForPreview(file: any) {
    this.selectedFile = file;
  }

  ngOnChanges() {
    this.uploadEnabled = this.sectionService.isSectionTypeAvailable(this.submissionId, SectionsType.Upload);
  }

  public onCompleteItem(workspaceitem: WorkspaceItem) {
    this.subs.push(
      this.uploadEnabled
        .pipe(first())
        .subscribe((isUploadEnabled) => {
          if (isUploadEnabled) {
            const { sections } = workspaceitem;
            const { errors } = workspaceitem;
            const errorsList = parseSectionErrors(errors);

            if (sections && isNotEmpty(sections)) {
              Object.keys(sections)
                .forEach((sectionId) => {
                  const sectionData = normalizeSectionData(sections[sectionId]);
                  const sectionErrors = errorsList[sectionId];
                  this.sectionService.isSectionType(this.submissionId, sectionId, SectionsType.Upload)
                    .pipe(take(1))
                    .subscribe((isUpload) => {
                      if (isUpload) {
                        if ((isEmpty(sectionErrors))) {
                          this.notificationsService.success(null, this.translate.get('submission.sections.upload.upload-successful'));
                        } else {
                          this.notificationsService.error(null, this.translate.get('submission.sections.upload.upload-failed'));
                        }
                      }
                    });
                  this.sectionService.updateSectionData(this.submissionId, sectionId, sectionData, sectionErrors, sectionErrors);
                });
            }
          }
        }),
    );
  }

  public onUploadError() {
    this.notificationsService.error(null, this.translate.get('submission.sections.upload.upload-failed'));
  }

  ngOnDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}