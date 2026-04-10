import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RestRequestMethod } from '@dspace/config/rest-request-method';
import { AuthService } from '@dspace/core/auth/auth.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import { normalizeSectionData } from '@dspace/core/submission/submission-response-parsing.service';
import {
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { UiSwitchModule } from 'ngx-ui-switch';
import { Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  first,
} from 'rxjs/operators';

import { UploaderComponent } from '../../../../../../shared/upload/uploader/uploader.component';
import { UploaderOptions } from '../../../../../../shared/upload/uploader/uploader-options.model';
import { FileSizePipe } from '../../../../../../shared/utils/file-size-pipe';
import { SubmissionService } from '../../../../../submission.service';
import parseSectionErrors from '../../../../../utils/parseSectionErrors';
import { SectionsService } from '../../../../sections.service';


@Component({
  selector: 'ds-submission-section-upload-file-replace',
  templateUrl: './submission-section-upload-file-replace.component.html',
  styleUrls: ['./submission-section-upload-file-replace.component.scss'],
  imports: [
    FileSizePipe,
    TranslatePipe,
    UiSwitchModule,
    UploaderComponent,
  ],
})
/**
 * Modal component used inside the submission/edit-item upload section to replace the content of
 * an existing Bitstream without changing its metadata or its position in the bundle.
 *
 * The component is opened by {@link SectionUploadFileComponent} when the user clicks the
 * "Replace" button next to a listed file.  It issues a `PUT` request to
 * `bitstreams/{uuid}/content`, the same endpoint used by {@link ReplaceBitstreamPageComponent}
 * from the Bitstream admin tab, with an optional `replaceName` query parameter that controls
 * whether the stored file name is updated to match the newly uploaded file.
 */
export class SubmissionSectionUploadFileReplaceComponent implements OnInit, OnDestroy {

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
   * The UUID of the bitstream being replaced.
   * Used to construct the correct content upload URL.
   */
  @Input() bitstreamUuid: string;

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
    autoUpload: false,
    method: RestRequestMethod.PUT,
  });

  /**
   * Upload url without parameters
   */
  private uploadFilesUrlNoParam: string;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  /**
   * Whether to keep the file name of the new uploaded file
   */
  protected shouldReplaceName = true;


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

  /**
   * After the bitstream content PUT succeeds: immediately close the modal and show success,
   * then asynchronously re-fetch the submission to refresh the ngrx store (and therefore the
   * file list in the parent component).
   *
   * Note: the upload endpoint (PUT bitstreams/{uuid}/content) returns a Bitstream, not a
   * WorkspaceItem — so we cannot read sections from the upload response itself.
   */
  protected onCompleteItem(_: unknown) {
    this.notificationsService.success(null, this.translate.get('submission.sections.upload.upload-successful'));
    this.activeModal.close();

    this.subs.push(
      this.submissionService.retrieveSubmission(this.submissionId).pipe(first()).subscribe((rd) => {
        if (!rd.isSuccess) {
          return;
        }
        const { sections, errors } = rd.payload;
        const errorsList = parseSectionErrors(errors);
        if (sections && isNotEmpty(sections)) {
          Object.keys(sections).forEach((sectionId) => {
            const sectionData = normalizeSectionData(sections[sectionId]);
            const sectionErrors = errorsList[sectionId];
            this.sectionService.updateSectionData(this.submissionId, sectionId, sectionData, sectionErrors, sectionErrors);
          });
        }
      }),
    );
  }

  onFileSelected(uploader: UploaderComponent): void {
    if (!hasValue(uploader.uploader)) {
      return;
    }
    // Only keep last file in queue
    uploader.uploader.queue.slice(0, -1).forEach((file) => {
      uploader.uploader?.removeFromQueue(file);
    });
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
  saveFile(uploader: UploaderComponent) {
    this.setUploadUrlParameters(uploader);
    uploader.uploader.uploadAll();
  }

  /**
   * Set the upload URL to the bitstream content endpoint for this specific bitstream.
   * Uses PUT to replace the existing file content, matching the behaviour of ReplaceBitstreamPageComponent.
   */
  private setUploadUrl() {
    this.subs.push(
      this.halService.getEndpoint('bitstreams').pipe(
        filter((href: string) => isNotEmpty(href)),
        distinctUntilChanged())
        .subscribe((endpointURL) => {
          this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
          this.uploadFilesUrlNoParam = `${endpointURL}/${this.bitstreamUuid}`;
          this.setUploadUrlParameters();
        }),
    );
  }

  protected setUploadUrlParameters(uploader?: UploaderComponent) {
    this.uploadFilesOptions.url = `${this.uploadFilesUrlNoParam}/content?replaceName=${this.shouldReplaceName}`;
    if (hasValue(uploader?.uploader?.options)) {
      uploader.uploader.options.url = this.uploadFilesOptions.url;
    }
  }

}
