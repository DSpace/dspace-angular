import { Component, Input, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BitstreamService } from '../../bitstream/bitstream.service';
import {hasValue, isUndefined} from '../../../../shared/empty.util';
import {
  DynamicDatePickerModel, DynamicFormArrayModel,
  DynamicFormControlModel, DynamicInputModel, DynamicSelectModel
} from '@ng-dynamic-forms/core';
import {
  BITSTREAM_FORM_MODEL, BITSTREAM_FORM_POLICIES_ARRAY_DATA, BITSTREAM_FORM_POLICIES_END_DATE_DATA,
  BITSTREAM_FORM_POLICIES_GROUPS_DATA,
  BITSTREAM_FORM_POLICIES_SELECT_DATA, BITSTREAM_FORM_POLICIES_START_DATE_DATA
} from './files-edit.model';
import { FormComponent } from '../../../../shared/form/form.component';
import { FormService } from '../../../../shared/form/form.service';
import { SubmissionUploadsConfigService } from '../../../../core/config/submission-uploads-config.service';
import { SubmissionUploadsModel } from '../../../../core/shared/config/config-submission-uploads.model';
import { GroupEpersonService } from '../../../../core/eperson/group-eperson.service';
import { FormBuilderService } from '../../../../shared/form/builder/form-builder.service';

@Component({
  selector: 'ds-submission-submit-form-box-files-edit',
  templateUrl: './files-edit.component.html',
})
export class FilesEditComponent {

  // The 'ViewChild' maps the variable only after the view init. And be sure to do not put the
  // ref inside an *ngIf or the output will be null until that part of HTML will be rendered.
  @ViewChild('formRef') formRef: FormComponent;

  @Input() bitstreamId;
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

  protected subscriptions = [];

  constructor(private modalService: NgbModal,
              private bitstreamService: BitstreamService,
              private uploadsConfigService: SubmissionUploadsConfigService,
              private groupEpersonService: GroupEpersonService,
              private formService: FormService,
              private formBuilderService: FormBuilderService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.bitstreamService
        .getBitstream(this.submissionId, this.sectionId, this.bitstreamId)
        .take(1)
        .subscribe((bitstream) => {
            this.bitstream = bitstream;
            const formModel                 = BITSTREAM_FORM_MODEL;
            const formPoliciesArrayData     = BITSTREAM_FORM_POLICIES_ARRAY_DATA;
            const formPoliciesSelectData    = BITSTREAM_FORM_POLICIES_SELECT_DATA;
            const formPoliciesStartDateData = BITSTREAM_FORM_POLICIES_START_DATE_DATA;
            const formPoliciesEndDateData   = BITSTREAM_FORM_POLICIES_END_DATE_DATA;
            const formPoliciesGroupsData    = BITSTREAM_FORM_POLICIES_GROUPS_DATA;
            this.formId = 'form_' + this.bitstreamId;
            this.subscriptions.push(
              this.uploadsConfigService.getConfigByHref(this.config)
                .flatMap((config) => config.payload)
                .take(1)
                .subscribe((config:SubmissionUploadsModel) => {
                    this.accessConditionOptions = config.accessConditionOptions;
                    if (config.accessConditionOptions.length > 0) {
                      for (const accessPolicy of config.accessConditionOptions) {
                        formPoliciesSelectData.data.options.push(
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
                      formPoliciesArrayData.data.groupFactory = () => {
                        const select    = new DynamicSelectModel(formPoliciesSelectData.data, formPoliciesSelectData.element);
                        const startDate = new DynamicDatePickerModel(formPoliciesStartDateData.data, formPoliciesStartDateData.element);
                        const endDate   = new DynamicDatePickerModel(formPoliciesEndDateData.data, formPoliciesEndDateData.element);
                        const groups    = new DynamicSelectModel(formPoliciesGroupsData.data, formPoliciesGroupsData.element);
                        /*select.cls.element.host    = select.cls.element.host.concat(' col');
                        groups.cls.element.host    = groups.cls.element.host.concat(' col');
                        startDate.cls.element.host = startDate.cls.element.host.concat(' col');
                        endDate.cls.element.host   = endDate.cls.element.host.concat(' col');*/
                        return [select, startDate, endDate, groups];
                      };
                      formModel.push(
                        new DynamicFormArrayModel(formPoliciesArrayData.data, formPoliciesArrayData.element)
                      );
                    }
                    this.formModel = formModel;
                  }
                )
            );
          }
        )
    );
  }

  public setFormInitialMetadata() {
    if (!this.initialized) {
      this.initialized = true;
      // Alternative mode to assign:
      // this.formRef.formGroup.controls['files-data'].controls.title.setValue(...);
      // Cannot put the following lines into 'ngOnInit' because 'this.formRef' is available only after the view init.
      // Cannot put the following lines into 'ngAfterViewInit' because of 'ExpressionChangedAfterItHasBeenCheckedError'.
      this.formRef.formGroup.get('files-data').get('title').setValue(this.bitstream.title);
      this.formRef.formGroup.get('files-data').get('description').setValue(this.bitstream.description);
    }
  }

  public switchMode(mode:boolean) {
    this.setFormInitialMetadata();
    this.readMode = mode;
  }

  public formChange(event) {
    if (event.model.id === 'policies') {
      const additionalFieldData = this.accessConditionOptions.filter((element) => element.name === event.control.value);
      if (!isUndefined(additionalFieldData[0].selectGroupUUID)) {
        /*const a = this.accessConditionGroups[additionalFieldData[0].selectGroupUUID];
        const groupModel = this.formBuilderService.findById('files-policies.0.policy-group', this.formModel) as DynamicInputModel;
        const c = this.formRef.formGroup.get('files-policies');
        const j = c.get('0.policy-group');
        const b = groupModel.valueUpdates;*/
      }
    }
  }

  public deleteBitstream() {
    this.bitstreamService.deleteBitstream(this.submissionId, this.sectionId, this.bitstreamId);
  }

  public editBitstream() {
    this.switchMode(true);
    this.subscriptions.push(
      this.formService.isValid(this.formRef.formUniqueId)
        .take(1)
        .subscribe((isValid) => {
          if (isValid) {
            this.subscriptions.push(
              this.formService.getFormData(this.formRef.formUniqueId)
                .take(1)
                .subscribe((metadata) => {
                  console.log(metadata);
                  const data = Object.assign(
                    {},
                    this.bitstream,
                    {
                      title: metadata['files-data'].title,
                      description: metadata['files-data'].description
                    }
                  );
                  this.bitstreamService.editBitstream(this.submissionId, this.sectionId, this.bitstreamId, data);
                }
              )
            );
          } else {
            this.formService.validateAllFormFields(this.formRef.formRef.control);
          }
        }
      )
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
