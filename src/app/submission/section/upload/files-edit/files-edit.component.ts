import { Component, Input, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BitstreamService } from '../../bitstream/bitstream.service';
import { hasValue, isNotEmpty, isNotUndefined, isUndefined } from '../../../../shared/empty.util';
import {
  DynamicDateControlModel,
  DynamicDatePickerModel, DynamicFormArrayGroupModel, DynamicFormArrayModel, DynamicFormControlEvent,
  DynamicFormControlModel, DynamicInputModel, DynamicSelectModel
} from '@ng-dynamic-forms/core';
import {
  BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_CLS,
  BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_CONFIG, BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_CLS,
  BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_CONFIG, BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CLS,
  BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CONFIG,
  BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_CLS,
  BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_CONFIG,
  BITSTREAM_FORM_ACCESS_CONDITION_TYPE_CLS,
  BITSTREAM_FORM_ACCESS_CONDITION_TYPE_CONFIG,
  BITSTREAM_METADATA_FORM_MODEL
} from './files-edit.model';
import { FormComponent } from '../../../../shared/form/form.component';
import { FormService } from '../../../../shared/form/form.service';
import { SubmissionUploadsConfigService } from '../../../../core/config/submission-uploads-config.service';
import { SubmissionUploadsModel } from '../../../../core/shared/config/config-submission-uploads.model';
import { GroupEpersonService } from '../../../../core/eperson/group-eperson.service';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';
import { CoreState } from '../../../../core/core.reducers';
import { Store } from '@ngrx/store';
import { JsonPatchOperationsBuilder } from '../../../../core/json-patch/builder/json-patch-operations-builder';
import { SubmissionRestService } from '../../../submission-rest.service';

@Component({
  selector: 'ds-submission-submit-form-box-files-edit',
  templateUrl: './files-edit.component.html',
})
export class FilesEditComponent {

  // The 'ViewChild' maps the variable only after the view init. And be sure to do not put the
  // ref inside an *ngIf or the output will be null until that part of HTML will be rendered.
  @ViewChild('formRef') formRef: FormComponent;

  @Input() bitstreamId;
  @Input() bitstreamIndex;
  @Input() sectionId;
  @Input() submissionId;
  @Input() config;
  public bitstream;
  public formId;
  public readMode = true;
  public initialized = false;
  public formModel: DynamicFormControlModel[];
  public accessConditionOptions;
  public accessConditionGroups = {};

  protected operationsBuilder: JsonPatchOperationsBuilder;
  protected subscriptions = [];

  constructor(private modalService: NgbModal,
              private bitstreamService: BitstreamService,
              private uploadsConfigService: SubmissionUploadsConfigService,
              private groupEpersonService: GroupEpersonService,
              private formService: FormService,
              private formBuilderService: FormBuilderService,
              protected operationsState: Store<CoreState>,
              private restService: SubmissionRestService) { }

  ngOnInit() {
    this.operationsBuilder = new JsonPatchOperationsBuilder(this.operationsState, 'sections', this.sectionId);
    this.subscriptions.push(
      this.bitstreamService
        .getBitstream(this.submissionId, this.sectionId, this.bitstreamId)
        .take(1)
        .subscribe((bitstream) => {
            this.bitstream = bitstream;
            this.formId = 'form_' + this.bitstreamId;
            this.subscriptions.push(
              this.uploadsConfigService.getConfigByHref(this.config)
                .flatMap((config) => config.payload)
                .take(1)
                .subscribe((config:SubmissionUploadsModel) => {
                    this.formModel = this.buildBitsreamEditForm(config);
                  }
                )
            );
          }
        )
    );
  }

  protected buildBitsreamEditForm(config:SubmissionUploadsModel) {
    const formModel = Object.create(BITSTREAM_METADATA_FORM_MODEL);
    const accessConditionTypeModel = Object.create(BITSTREAM_FORM_ACCESS_CONDITION_TYPE_CONFIG);
    const accessConditionsArrayConfig = Object.create(BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_CONFIG);
    const accessConditionTypeOptions = [];
    this.accessConditionOptions = config.accessConditionOptions;

    if (config.accessConditionOptions.length > 0) {
      for (const accessPolicy of config.accessConditionOptions) {
        accessConditionTypeOptions.push(
          {
            label: accessPolicy.name,
            value: accessPolicy.name
          }
        );
        if (!isUndefined(accessPolicy.groupUUID)) {
          this.subscriptions.push(
            this.groupEpersonService.getDataByUuid(accessPolicy.groupUUID)
              .take(1)
              .flatMap((group) => group.payload)
              .subscribe((group) => {
                  if (group.groups.length > 0 && isUndefined(this.accessConditionGroups[group.uuid])) {
                    let groupArrayData;
                    for (const groupData of group.groups) {
                      groupArrayData = { name: groupData.name, uuid: groupData.uuid };
                    }
                    this.accessConditionGroups[group.uuid] = groupArrayData;
                  } else {
                    this.accessConditionGroups[group.uuid] = { name: group.name, uuid: group.uuid };
                  }
                }
              )
          );
        }
      }
      accessConditionTypeModel.options = accessConditionTypeOptions;

      accessConditionsArrayConfig.groupFactory = () => {
        const type = new DynamicSelectModel(accessConditionTypeModel, BITSTREAM_FORM_ACCESS_CONDITION_TYPE_CLS);
        const startDate = new DynamicDatePickerModel(BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_CONFIG, BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_CLS);
        const endDate = new DynamicDatePickerModel(BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_CONFIG, BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_CLS);
        const groups    = new DynamicSelectModel(BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CONFIG, BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CLS);
        return [type, startDate, endDate, groups];
      };
      formModel.push(
        new DynamicFormArrayModel(accessConditionsArrayConfig, BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_CLS)
      );
    }
    return formModel;
  }

  public setFormInitialMetadata() {
    if (!this.initialized) {
      this.initialized = true;
      // Alternative mode to assign:
      // this.formRef.formGroup.controls['files-data'].controls.title.setValue(...);
      // Cannot put the following lines into 'ngOnInit' because 'this.formRef' is available only after the view init.
      // Cannot put the following lines into 'ngAfterViewInit' because of 'ExpressionChangedAfterItHasBeenCheckedError'.
      this.formRef.formGroup.get('metadata').get('dc_title').setValue(this.bitstream.title);
      this.formRef.formGroup.get('metadata').get('dc_description').setValue(this.bitstream.description);
    }
  }

  public switchMode(mode:boolean) {
    this.setFormInitialMetadata();
    this.readMode = mode;
  }

  public onChange(event: DynamicFormControlEvent) {
    if (event.model.id === 'type') {
      const additionalFieldData = this.accessConditionOptions.filter((element) => element.name === event.control.value);
      if (isNotEmpty(additionalFieldData)) {
        if (isNotUndefined(additionalFieldData[0].groupUUID)) {
          const groupModel = this.formBuilderService.findById(
            'groupUUID',
            (event.model.parent as DynamicFormArrayGroupModel).group) as DynamicSelectModel<any>;

          groupModel.options = [
            {
              label: this.accessConditionGroups[additionalFieldData[0].groupUUID].name,
              value: this.accessConditionGroups[additionalFieldData[0].groupUUID].uuid
            }
          ];
          if (event.control.value !== 'lease' && event.control.value !== 'embargo') {
            groupModel.value = this.accessConditionGroups[additionalFieldData[0].groupUUID].uuid;
          }
        }
        if (event.control.value === 'lease' || event.control.value === 'embargo') {
          if (additionalFieldData[0].hasStartDate) {
            const startDateModel = this.formBuilderService.findById(
              'startDate',
              (event.model.parent as DynamicFormArrayGroupModel).group) as DynamicDateControlModel;
            startDateModel.min = new Date(additionalFieldData[0].maxStartDate);
          }
          if (additionalFieldData[0].hasEndDate) {
            const endDateModel = this.formBuilderService.findById(
              'endDate',
              (event.model.parent as DynamicFormArrayGroupModel).group) as DynamicDateControlModel;
            endDateModel.max = new Date(additionalFieldData[0].maxEndDate);
          }
        }
      }
    }
  }

  public deleteBitstream() {
    this.bitstreamService.deleteBitstream(this.submissionId, this.sectionId, this.bitstreamId);
    this.operationsBuilder.remove(this.bitstreamIndex);
    this.restService.jsonPatchByResourceID(this.submissionId, 'sections',this.sectionId)
      .subscribe();
  }

  public editBitstream() {
    this.switchMode(true);
  }

  public saveBitstreamData() {
    this.subscriptions.push(
      this.formService.isValid(this.formRef.formUniqueId)
        .take(1)
        .subscribe((isValid) => {
          if (isValid) {
            this.subscriptions.push(
              this.formService.getFormData(this.formRef.formUniqueId)
                .take(1)
                .subscribe((formData: any) => {
                  console.log(formData.metadata);
                  // metadata.get('metadata.dc_title');
                  const metadatum = [];
                  Object.keys((formData.metadata))
                    .forEach((key) => {
                      metadatum.push({key: key, value: formData.metadata[key]})
                    });

                  const fileData = Object.assign({}, this.bitstream, {
                    metadata: metadatum,
                    accessConditions: formData.accessConditions
                  });
                  const titlePath = `${this.bitstreamIndex}/metadata/dc.title`;
                  const descriptionPath = `${this.bitstreamIndex}/metadata/dc.description`;
                  const accessConditionPath = `${this.bitstreamIndex}/accessConditions`;
                  /*const accessCondition = [
                    { name: formData['files-policies'][0].policies,
                      groupUUID: '3522e898-fe96-45ea-8538-65f1cf9128a8',
                      endDate: null }];*/
                  this.operationsBuilder.replace(titlePath, formData.metadata.dc_title);
                  this.operationsBuilder.replace(descriptionPath, formData.metadata.dc_description);
                  this.operationsBuilder.add(accessConditionPath, formData.accessConditions);
                  this.restService.jsonPatchByResourceID(this.submissionId, 'sections',this.sectionId)
                    .subscribe();
                  this.bitstreamService.editBitstream(this.submissionId, this.sectionId, this.bitstreamId, fileData);
                })
            );
          } else {
            this.formService.validateAllFormFields(this.formRef.formRef.control);
          }
        })
    );
  }

  public openModal(content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.deleteBitstream();
        }
      }
    );
  }

  /**
   * Method provided by Angular. Invoked when the instance is destroyed.
   */
  ngOnDestroy() {
    this.subscriptions
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}
