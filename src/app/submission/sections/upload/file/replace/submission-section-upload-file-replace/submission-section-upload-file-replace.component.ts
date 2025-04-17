import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { WorkspaceItem } from '../../../../../../core/submission/models/workspaceitem.model';
import { first, take, distinctUntilChanged, filter } from 'rxjs/operators';
import parseSectionErrors from '../../../../../utils/parseSectionErrors';
import { isNotEmpty, hasValue, isEmpty } from '../../../../../../shared/empty.util';
import { normalizeSectionData } from '../../../../../../core/submission/submission-response-parsing.service';
import { SectionsType } from '../../../../sections-type';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../../../../../shared/notifications/notifications.service';
import { SectionsService } from '../../../../sections.service';
import { SubmissionService } from '../../../../../submission.service';
import { UploaderOptions } from '../../../../../../shared/upload/uploader/uploader-options.model';
import { Subscription, Observable, of as observableOf } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UploaderComponent } from '../../../../../../shared/upload/uploader/uploader.component';
import { HALEndpointService } from '../../../../../../core/shared/hal-endpoint.service';
import { AuthService } from '../../../../../../core/auth/auth.service';


@Component({
  selector: 'ds-submission-section-upload-file-replace',
  templateUrl: './submission-section-upload-file-replace.component.html',
  styleUrls: ['./submission-section-upload-file-replace.component.scss']
})
export class SubmissionSectionUploadFileReplaceComponent implements OnInit, OnChanges, OnDestroy {

  /**
   * The submission id
   * @type {string}
   */
  @Input() submissionId: string;

  /**
   * The bitstream id
   * @type {string}
   */
  @Input() fileName: string;

  /**
   * The bitstream array key
   * @type {string}
   */
  @Input() fileIndex: string;

  /**
   * The file size
   */
  @Input() fileSizeBytes: number;

  /**
   * The uploader configuration options
   * @type {UploaderOptions}
   */
  protected uploadFilesOptions: UploaderOptions = Object.assign(new UploaderOptions(), {
    // URL needs to contain something to not produce any errors. This will be replaced once a bundle has been selected.
    url: 'placeholder', /* TODO Change upload URL */
    authToken: null,
    disableMultipart: false,
    itemAlias: null,
    autoUpload: false
  });

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  /**
   * A boolean representing if upload functionality is enabled
   * @type {boolean}
   */
  private uploadEnabled: Observable<boolean> = observableOf(true);


  constructor(
    protected activeModal: NgbActiveModal,
    private authService: AuthService,
    private halService: HALEndpointService,
    private notificationsService: NotificationsService,
    private sectionService: SectionsService,
    private submissionService: SubmissionService,
    private translate: TranslateService) {
  }

  ngOnInit() {
    this.setUploadUrl();
  }

  ngOnChanges() {
    this.uploadEnabled = this.sectionService.isSectionTypeAvailable(this.submissionId, SectionsType.Upload);
  }

  /**
   * Parses the submission object retrieved from REST after upload
   *
   * @param workspaceitem
   *    The submission object retrieved from REST
   */
  protected onCompleteItem(workspaceitem: WorkspaceItem) {
    // Checks if upload section is enabled so do upload
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
                        // Look for errors on upload
                        if ((isEmpty(sectionErrors))) {
                          this.notificationsService.success(null, this.translate.get('submission.sections.upload.upload-successful'));
                          this.closeModal();
                        } else {
                          this.notificationsService.error(null, this.translate.get('submission.sections.upload.upload-failed'));
                        }
                      }
                    });
                  this.sectionService.updateSectionData(this.submissionId, sectionId, sectionData, sectionErrors, sectionErrors);
                });
            }
          }
        })
    );
  }

  protected onUploadError(): void {
    this.notificationsService.error(null, this.translate.get('submission.sections.upload.upload-failed'));
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

  /**
   * Closes the modal.
   */
  protected closeModal(): void {
    this.activeModal.dismiss();
  }

  /**
   * Uploads the new replacing bitstream, if any.
   */
  protected saveFile(uploader: UploaderComponent) {
    uploader.uploader.uploadAll();
  }

  /**
   * Set the replace url to match the selected bitstream ID
   */
  private setUploadUrl() {
    this.subs.push(
      this.halService.getEndpoint(this.submissionService.getSubmissionObjectLinkName()).pipe(
        filter((href: string) => isNotEmpty(href)),
        distinctUntilChanged())
        .subscribe((endpointURL) => {
          this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
          this.uploadFilesOptions.url = endpointURL.concat(`/${this.submissionId}?replaceFile=${this.fileIndex}`);
        })
    );
  }

}
