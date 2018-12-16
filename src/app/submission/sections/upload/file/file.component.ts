import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SectionUploadService } from '../section-upload.service';
import { isNotEmpty, isNotNull, isNotUndefined } from '../../../../shared/empty.util';
import { DynamicFormControlModel, } from '@ng-dynamic-forms/core';

import { FormService } from '../../../../shared/form/form.service';
import { JsonPatchOperationsBuilder } from '../../../../core/json-patch/builder/json-patch-operations-builder';
import { JsonPatchOperationPathCombiner } from '../../../../core/json-patch/builder/json-patch-operation-path-combiner';

import { WorkspaceitemSectionUploadFileObject } from '../../../../core/submission/models/workspaceitem-section-upload-file.model';
import { SubmissionFormsModel } from '../../../../core/config/models/config-submission-forms.model';
import { deleteProperty } from '../../../../shared/object.util';
import { dateToGMTString } from '../../../../shared/date.util';
import { JsonPatchOperationsService } from '../../../../core/json-patch/json-patch-operations.service';
import { SubmitDataResponseDefinitionObject } from '../../../../core/shared/submit-data-response-definition.model';
import { SubmissionService } from '../../../submission.service';
import { FileService } from '../../../../core/shared/file.service';
import { HALEndpointService } from '../../../../core/shared/hal-endpoint.service';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: 'ds-submission-upload-section-file',
  styleUrls: ['./file.component.scss'],
  templateUrl: './file.component.html',
})
export class UploadSectionFileComponent implements OnChanges, OnInit {

  @Input() availableAccessConditionOptions: any[];
  @Input() availableAccessConditionGroups: Map<string, any>;
  @Input() collectionId;
  @Input() collectionPolicyType;
  @Input() configMetadataForm: SubmissionFormsModel;
  @Input() fileId;
  @Input() fileIndex;
  @Input() fileName;
  @Input() sectionId;
  @Input() submissionId;

  public fileData: WorkspaceitemSectionUploadFileObject;
  public formId;
  public formState;
  public readMode;
  public formModel: DynamicFormControlModel[];

  protected pathCombiner: JsonPatchOperationPathCombiner;
  protected subscriptions = [];

  constructor(private cdr: ChangeDetectorRef,
              private fileService: FileService,
              private formService: FormService,
              private halService: HALEndpointService,
              private modalService: NgbModal,
              private operationsBuilder: JsonPatchOperationsBuilder,
              private operationsService: JsonPatchOperationsService<SubmitDataResponseDefinitionObject>,
              private submissionService: SubmissionService,
              private uploadService: SectionUploadService) {
    this.readMode = true;
  }

  ngOnChanges() {
    if (this.availableAccessConditionOptions && this.availableAccessConditionGroups) {
      // Retrieve file state
      this.subscriptions.push(
        this.uploadService
          .getFileData(this.submissionId, this.sectionId, this.fileId).pipe(
          filter((bitstream) => isNotUndefined(bitstream)))
          .subscribe((bitstream) => {
              this.fileData = bitstream;
            }
          )
      );
    }
  }

  ngOnInit() {
    this.formId = this.formService.getUniqueId(this.fileId);
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionId, 'files', this.fileIndex);
  }

  protected deleteFile() {
    this.uploadService.removeUploadedFile(this.submissionId, this.sectionId, this.fileId);
    this.operationsBuilder.remove(this.pathCombiner.getPath());
    this.operationsService.jsonPatchByResourceID(
      this.submissionService.getSubmissionObjectLinkName(),
      this.submissionId,
      this.pathCombiner.rootElement,
      this.pathCombiner.subRootElement)
      .subscribe();
  }

  public confirmDelete(content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.deleteFile();
        }
      }
    );
  }

  public downloadBitstreamFile() {
    this.halService.getEndpoint('bitstreams').pipe(
      first())
      .subscribe((url) => {
        const fileUrl = `${url}/${this.fileData.uuid}/content`;
        this.fileService.downloadFile(fileUrl);
      });
  }

  public saveBitstreamData(event) {
    event.preventDefault();
    this.subscriptions.push(
      this.formService.getFormData(this.formId).pipe(
        first())
        .subscribe((formData: any) => {
          Object.keys((formData.metadata))
            .filter((key) => isNotEmpty(formData.metadata[key]))
            .forEach((key) => {
              const metadataKey = key.replace(/_/g, '.');
              const path = `metadata/${metadataKey}`;
              this.operationsBuilder.add(this.pathCombiner.getPath(path), formData.metadata[key], true);
            });
          const accessConditionsToSave = [];
          formData.accessConditions
            .filter((accessCondition) => isNotEmpty(accessCondition))
            .forEach((accessCondition) => {
              let accessConditionOpt;

              this.availableAccessConditionOptions
                .filter((element) => isNotNull(accessCondition.name) && element.name === accessCondition.name[0].value)
                .forEach((element) => accessConditionOpt = element);

              if (accessConditionOpt) {

                if (accessConditionOpt.hasStartDate !== true && accessConditionOpt.hasEndDate !== true) {
                  accessConditionOpt = deleteProperty(accessConditionOpt, 'hasStartDate');

                  accessConditionOpt = deleteProperty(accessConditionOpt, 'hasEndDate');
                  accessConditionsToSave.push(accessConditionOpt);
                } else {
                  accessConditionOpt = Object.assign({}, accessCondition);
                  accessConditionOpt.name = this.retrieveValueFromField(accessCondition.name);
                  accessConditionOpt.groupUUID = this.retrieveValueFromField(accessCondition.groupUUID);
                  if (accessCondition.startDate) {
                    const startDate = this.retrieveValueFromField(accessCondition.startDate);
                    accessConditionOpt.startDate = dateToGMTString(startDate);
                    accessConditionOpt = deleteProperty(accessConditionOpt, 'endDate');
                  }
                  if (accessCondition.endDate) {
                    const endDate = this.retrieveValueFromField(accessCondition.endDate);
                    accessConditionOpt.endDate = dateToGMTString(endDate);
                    accessConditionOpt = deleteProperty(accessConditionOpt, 'startDate');
                  }
                  accessConditionsToSave.push(accessConditionOpt);
                }
              }
            });

          if (isNotEmpty(accessConditionsToSave)) {
            this.operationsBuilder.add(this.pathCombiner.getPath('accessConditions'), accessConditionsToSave, true);
          }

          this.operationsService.jsonPatchByResourceID(
            this.submissionService.getSubmissionObjectLinkName(),
            this.submissionId,
            this.pathCombiner.rootElement,
            this.pathCombiner.subRootElement)
            .subscribe((result) => {
              Object.keys(result[0].sections.upload.files)
                .filter((key) => result[0].sections.upload.files[key].uuid === this.fileId)
                .forEach((key) => this.uploadService.updateFileData(
                  this.submissionId,
                  this.sectionId,
                  this.fileId,
                  result[0].sections.upload.files[key]));
              this.switchMode();
            });
        })
    );
  }

  private retrieveValueFromField(field) {
    const temp = Array.isArray(field) ? field[0] : field;
    return (temp) ? temp.value : undefined;
  }

  public switchMode() {
    this.readMode = !this.readMode;
    this.cdr.detectChanges();
  }

}
