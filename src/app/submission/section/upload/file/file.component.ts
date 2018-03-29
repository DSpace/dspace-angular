import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SectionUploadService } from '../section-upload.service';
import { isNotEmpty, isNotNull, isNotUndefined } from '../../../../shared/empty.util';
import { DynamicFormControlModel, } from '@ng-dynamic-forms/core';

import { FormService } from '../../../../shared/form/form.service';
import { JsonPatchOperationsBuilder } from '../../../../core/json-patch/builder/json-patch-operations-builder';
import { JsonPatchOperationPathCombiner } from '../../../../core/json-patch/builder/json-patch-operation-path-combiner';

import { WorkspaceitemSectionUploadFileObject } from '../../../../core/submission/models/workspaceitem-section-upload-file.model';
import { SubmissionFormsModel } from '../../../../core/shared/config/config-submission-forms.model';
import { deleteProperty } from '../../../../shared/object.util';
import { dateToGMTString } from '../../../../shared/date.util';
import { JsonPatchOperationsService } from '../../../../core/json-patch/json-patch-operations.service';
import { SubmitDataResponseDefinitionObject } from '../../../../core/shared/submit-data-response-definition.model';
import { SubmissionService } from '../../../submission.service';

@Component({
  selector: 'ds-submission-upload-section-file',
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
              private formService: FormService,
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
          .getFileData(this.submissionId, this.sectionId, this.fileId)
          .filter((bitstream) => isNotUndefined(bitstream))
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

  public saveBitstreamData(event) {
    event.preventDefault();
    this.subscriptions.push(
      this.formService.getFormData(this.formId)
        .take(1)
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
            .forEach((accessCondition, index) => {
              let accessConditionOpt;
              this.availableAccessConditionOptions
                .filter((element) => isNotNull(accessCondition.name) && element.name === accessCondition.name[0])
                .forEach((element) => accessConditionOpt = element);
              if (accessConditionOpt) {
                const path = `accessConditions/${index}`;
                if (accessConditionOpt.hasStartDate !== true && accessConditionOpt.hasEndDate !== true) {
                  accessConditionOpt = deleteProperty(accessConditionOpt, 'hasStartDate');

                  accessConditionOpt = deleteProperty(accessConditionOpt, 'hasEndDate');
                  accessConditionsToSave.push(accessConditionOpt);
                } else {
                  accessConditionOpt = Object.assign({}, accessCondition);
                  accessConditionOpt.name = Array.isArray(accessCondition.name) ? accessCondition.name[0] : accessCondition.name;
                  accessConditionOpt.groupUUID = Array.isArray(accessCondition.groupUUID) ? accessCondition.groupUUID[0] : accessCondition.groupUUID;
                  if (accessCondition.startDate) {
                    const startDate = Array.isArray(accessCondition.startDate) ? accessCondition.startDate[0] : accessCondition.startDate;
                    accessConditionOpt.startDate = dateToGMTString(startDate);
                    accessConditionOpt = deleteProperty(accessConditionOpt, 'endDate');
                  }
                  if (accessCondition.endDate) {
                    const endDate = Array.isArray(accessCondition.endDate) ? accessCondition.endDate[0] : accessCondition.endDate;
                    accessConditionOpt.endDate = dateToGMTString(endDate);
                    accessConditionOpt = deleteProperty(accessConditionOpt, 'startDate');
                  }
                  accessConditionsToSave.push(accessConditionOpt);
                }
              }
            });
          this.operationsBuilder.add(this.pathCombiner.getPath('accessConditions'), accessConditionsToSave, true);
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

  public switchMode() {
    this.readMode = !this.readMode;
    this.cdr.detectChanges();
  }
}
