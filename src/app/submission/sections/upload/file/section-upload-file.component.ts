import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap/modal/modal-config';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
} from 'rxjs';
import { filter } from 'rxjs/operators';

import { SubmissionFormsModel } from '../../../../core/config/models/config-submission-forms.model';
import { JsonPatchOperationPathCombiner } from '../../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../../../../core/json-patch/builder/json-patch-operations-builder';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { WorkspaceitemSectionUploadFileObject } from '../../../../core/submission/models/workspaceitem-section-upload-file.model';
import { SubmissionJsonPatchOperationsService } from '../../../../core/submission/submission-json-patch-operations.service';
import { BtnDisabledDirective } from '../../../../shared/btn-disabled.directive';
import {
  hasValue,
  isNotUndefined,
} from '../../../../shared/empty.util';
import { ThemedFileDownloadLinkComponent } from '../../../../shared/file-download-link/themed-file-download-link.component';
import { FormService } from '../../../../shared/form/form.service';
import { SubmissionService } from '../../../submission.service';
import { SectionUploadService } from '../section-upload.service';
import { SubmissionSectionUploadFileEditComponent } from './edit/section-upload-file-edit.component';
import { SubmissionSectionUploadFileViewComponent } from './view/section-upload-file-view.component';

/**
 * This component represents a single bitstream contained in the submission
 */
@Component({
  selector: 'ds-base-submission-upload-section-file',
  styleUrls: ['./section-upload-file.component.scss'],
  templateUrl: './section-upload-file.component.html',
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    SubmissionSectionUploadFileViewComponent,
    ThemedFileDownloadLinkComponent,
    TranslateModule,
  ],
  standalone: true,
})
export class SubmissionSectionUploadFileComponent implements OnChanges, OnInit, OnDestroy {
  /**
   * The indicator is the primary bitstream
   * it will be null if no primary bitstream is set for the ORIGINAL bundle
   * @type {boolean, null}
   */
  @Input() isPrimary: boolean | null;

  /**
   * The list of available access condition
   * @type {Array}
   */
  @Input() availableAccessConditionOptions: any[];

  /**
   * The submission id
   * @type {string}
   */
  @Input() collectionId: string;

  /**
   * Define if collection access conditions policy type :
   * POLICY_DEFAULT_NO_LIST : is not possible to define additional access group/s for the single file
   * POLICY_DEFAULT_WITH_LIST : is possible to define additional access group/s for the single file
   * @type {number}
   */
  @Input() collectionPolicyType: number;

  /**
   * The configuration for the bitstream's metadata form
   * @type {SubmissionFormsModel}
   */
  @Input() configMetadataForm: SubmissionFormsModel;

  /**
   * The bitstream id
   * @type {string}
   */
  @Input() fileId: string;

  /**
   * The bitstream array key
   * @type {string}
   */
  @Input() fileIndex: string;

  /**
   * The bitstream id
   * @type {string}
   */
  @Input() fileName: string;

  /**
   * The section id
   * @type {string}
   */
  @Input() sectionId: string;

  /**
   * The submission id
   * @type {string}
   */
  @Input() submissionId: string;

  /**
   * The [[SubmissionSectionUploadFileEditComponent]] reference
   * @type {SubmissionSectionUploadFileEditComponent}
   */
  @ViewChild(SubmissionSectionUploadFileEditComponent) fileEditComp: SubmissionSectionUploadFileEditComponent;

  /**
   * A boolean representing if a submission save operation is pending
   * @type {Observable<boolean>}
   */
  public processingSaveStatus$: Observable<boolean>;

  /**
   * The bitstream's metadata data
   * @type {WorkspaceitemSectionUploadFileObject}
   */
  public fileData: WorkspaceitemSectionUploadFileObject;

  /**
   * The form id
   * @type {string}
   */
  public formId: string;

  /**
   * A boolean representing if to show bitstream edit form
   * @type {boolean}
   */
  public readMode: boolean;

  /**
   * The form model
   * @type {DynamicFormControlModel[]}
   */
  public formModel: DynamicFormControlModel[];

  /**
   * A boolean representing if a submission delete operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  public processingDelete$ = new BehaviorSubject<boolean>(false);

  /**
   * The [JsonPatchOperationPathCombiner] object
   * @type {JsonPatchOperationPathCombiner}
   */
  protected pathCombiner: JsonPatchOperationPathCombiner;

  /**
   * The [JsonPatchOperationPathCombiner] object
   * @type {JsonPatchOperationPathCombiner}
   */
  protected primaryBitstreamPathCombiner: JsonPatchOperationPathCombiner;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  protected subscriptions: Subscription[] = [];

  /**
   * Array containing all the form metadata defined in configMetadataForm
   * @type {Array}
   */
  protected formMetadata: string[] = [];

  /**
   * Initialize instance variables
   *
   * @param {ChangeDetectorRef} cdr
   * @param {FormService} formService
   * @param {HALEndpointService} halService
   * @param {NgbModal} modalService
   * @param {JsonPatchOperationsBuilder} operationsBuilder
   * @param {SubmissionJsonPatchOperationsService} operationsService
   * @param {SubmissionService} submissionService
   * @param {SectionUploadService} uploadService
   */
  constructor(
    private formService: FormService,
    private modalService: NgbModal,
    private operationsBuilder: JsonPatchOperationsBuilder,
    private operationsService: SubmissionJsonPatchOperationsService,
    private submissionService: SubmissionService,
    private uploadService: SectionUploadService,
  ) {
    this.readMode = true;
  }

  /**
   * Retrieve bitstream's metadata
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.availableAccessConditionOptions) {
      // Retrieve file state
      this.subscriptions.push(
        this.uploadService
          .getFileData(this.submissionId, this.sectionId, this.fileId)
          .pipe(filter((bitstream) => isNotUndefined(bitstream)))
          .subscribe((bitstream) => {
            this.fileData = bitstream;
          },
          ),
      );
    }
  }

  /**
   * Initialize instance variables
   */
  ngOnInit() {
    this.formId = this.formService.getUniqueId(this.fileId);
    this.processingSaveStatus$ = this.submissionService.getSubmissionSaveProcessingStatus(this.submissionId);
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionId);
    this.loadFormMetadata();
  }

  /**
   * Show confirmation dialog for delete
   */
  public confirmDelete(content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.processingDelete$.next(true);
          this.deleteFile();
        }
      },
    );
  }

  /**
   * Build a Bitstream object by the current file uuid
   *
   * @return Bitstream object
   */
  public getBitstream(): Bitstream {
    return Object.assign(new Bitstream(), {
      uuid: this.fileData.uuid,
    });
  }

  editBitstreamData() {

    const options: NgbModalOptions = {
      size: 'xl',
      backdrop: 'static',
    };

    const activeModal = this.modalService.open(SubmissionSectionUploadFileEditComponent, options);

    activeModal.componentInstance.availableAccessConditionOptions = this.availableAccessConditionOptions;
    activeModal.componentInstance.collectionId = this.collectionId;
    activeModal.componentInstance.collectionPolicyType = this.collectionPolicyType;
    activeModal.componentInstance.configMetadataForm = this.configMetadataForm;
    activeModal.componentInstance.fileData = this.fileData;
    activeModal.componentInstance.fileId = this.fileId;
    activeModal.componentInstance.fileIndex = this.fileIndex;
    activeModal.componentInstance.formId = this.formId;
    activeModal.componentInstance.sectionId = this.sectionId;
    activeModal.componentInstance.formMetadata = this.formMetadata;
    activeModal.componentInstance.pathCombiner = this.pathCombiner;
    activeModal.componentInstance.submissionId = this.submissionId;
    activeModal.componentInstance.isPrimary = this.isPrimary;
  }

  togglePrimaryBitstream(event) {
    this.uploadService.updatePrimaryBitstreamOperation(this.pathCombiner.getPath('primary'), this.isPrimary, event.target.checked, this.fileId);
    this.submissionService.dispatchSaveSection(this.submissionId, this.sectionId);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  unsubscribeAll() {
    this.subscriptions.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  protected loadFormMetadata() {
    this.configMetadataForm.rows.forEach((row) => {
      row.fields.forEach((field) => {
        field.selectableMetadata.forEach((metadatum) => {
          this.formMetadata.push(metadatum.metadata);
        });
      });
    },
    );
  }

  /**
   * Delete bitstream from submission
   */
  protected deleteFile() {
    this.operationsBuilder.remove(this.pathCombiner.getPath(['files', this.fileIndex]));
    if (this.isPrimary) {
      this.operationsBuilder.remove(this.pathCombiner.getPath('primary'));
    }

    this.subscriptions.push(this.operationsService.jsonPatchByResourceID(
      this.submissionService.getSubmissionObjectLinkName(),
      this.submissionId,
      this.pathCombiner.rootElement,
      this.pathCombiner.subRootElement)
      .subscribe(() => {
        if (this.isPrimary) {
          this.uploadService.updateFilePrimaryBitstream(this.submissionId, this.sectionId, null);
        }
        this.uploadService.removeUploadedFile(this.submissionId, this.sectionId, this.fileId);
        this.processingDelete$.next(false);
      }));
  }

}
