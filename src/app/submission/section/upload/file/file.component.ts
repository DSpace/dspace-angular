import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SectionUploadService } from '../section-upload.service';
import { isNotEmpty, isNotUndefined } from '../../../../shared/empty.util';
import {  DynamicFormControlModel, } from '@ng-dynamic-forms/core';

import {FormService} from '../../../../shared/form/form.service';
import {FormBuilderService} from '../../../../shared/form/builder/form-builder.service';
import {JsonPatchOperationsBuilder} from '../../../../core/json-patch/builder/json-patch-operations-builder';
import {SubmissionRestService} from '../../../submission-rest.service';
import {JsonPatchOperationPathCombiner} from '../../../../core/json-patch/builder/json-patch-operation-path-combiner';

import { WorkspaceitemSectionUploadFileObject } from '../../../models/workspaceitem-section-upload-file.model';
import { SubmissionFormsModel } from '../../../../core/shared/config/config-submission-forms.model';
import { AccessConditionOption } from '../../../../core/shared/config/config-access-condition-option.model';
import { deleteProperty } from '../../../../shared/object.util';

@Component({
  selector: 'ds-submission-upload-section-file',
  templateUrl: './file.component.html',
})
export class UploadSectionFileComponent implements OnChanges, OnInit {

  @Input() availableAccessConditionOptions: any[];
  @Input() availableAccessConditionGroups: Map<string, any>;
  @Input() collectionPolicyType;
  @Input() configMetadataForm: SubmissionFormsModel;
  @Input() fileId;
  @Input() fileIndex;
  @Input() sectionId;
  @Input() submissionId;

  public fileData: WorkspaceitemSectionUploadFileObject;
  public formId;
  public formState;
  public readMode = true;
  public formModel: DynamicFormControlModel[];

  protected pathCombiner: JsonPatchOperationPathCombiner;
  protected subscriptions = [];

  constructor(private formService: FormService,
              private modalService: NgbModal,
              private operationsBuilder: JsonPatchOperationsBuilder,
              private restService: SubmissionRestService,
              private uploadService: SectionUploadService,) {
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
    // TODO Use this when server is ok
    // this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionId, 'files', this.fileIndex);
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionId, this.fileIndex);
    /*this.formService.getFormData(this.formId)
      .filter((formState) => isNotUndefined(formState))
      .subscribe((formState) => {
        this.formState = formState;
        console.log(this.formState);
      })*/
  }

  protected deleteFile() {
    this.uploadService.deleteBitstream(this.submissionId, this.sectionId, this.fileId);
    this.operationsBuilder.remove(this.pathCombiner.getPath());
    this.restService.jsonPatchByResourceID(
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
              this.operationsBuilder.replace(this.pathCombiner.getPath(path), formData.metadata[key]);
            });
          formData.accessConditions
            .forEach((accessCondition) => {
              let accessConditionOpt;
              this.availableAccessConditionOptions.filter((element) => element.name === accessCondition.name)
                .forEach((element) => accessConditionOpt = element);
              if (accessConditionOpt.hasStartDate !== true && accessConditionOpt.hasEndDate !== true) {
                accessConditionOpt = deleteProperty(accessConditionOpt, 'hasStartDate');
                accessConditionOpt = deleteProperty(accessConditionOpt, 'hasEndDate');
                this.operationsBuilder.add(this.pathCombiner.getPath('accessConditions'), accessConditionOpt);
              } else {
                this.operationsBuilder.add(this.pathCombiner.getPath('accessConditions'), accessCondition);
              }
            });
          this.restService.jsonPatchByResourceID(
            this.submissionId,
            this.pathCombiner.rootElement,
            this.pathCombiner.subRootElement)
            .subscribe((result) => {
              this.switchMode();
              console.log(result);
            });
        })
    );
  }

  public switchMode() {
    this.readMode = !this.readMode;
  }
}
