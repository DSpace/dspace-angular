import { Component, Input, OnChanges } from '@angular/core';

import { WorkspaceitemSectionUploadFileObject } from '../../../../models/workspaceitem-section-upload-file.model';
import {
  DynamicDateControlModel,
  DynamicDatePickerModel,
  DynamicFormArrayGroupModel,
  DynamicFormArrayModel,
  DynamicFormControlEvent,
  DynamicFormControlModel,
  DynamicFormGroupModel,
  DynamicSelectModel
} from '@ng-dynamic-forms/core';
import { FormBuilderService } from '../../../../../shared/form/builder/form-builder.service';
import {
  BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_CLS,
  BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_CONFIG,
  BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_CLS,
  BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_CONFIG,
  BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CLS,
  BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CONFIG,
  BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_CLS,
  BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_CONFIG,
  BITSTREAM_FORM_ACCESS_CONDITION_TYPE_CLS,
  BITSTREAM_FORM_ACCESS_CONDITION_TYPE_CONFIG,
  BITSTREAM_METADATA_FORM_GROUP_CLS,
  BITSTREAM_METADATA_FORM_GROUP_CONFIG
} from './files-edit.model';
import { POLICY_DEFAULT_WITH_LIST } from '../../section-upload.component';
import { isNotEmpty, isNotUndefined } from '../../../../../shared/empty.util';
import { SubmissionFormsModel } from '../../../../../core/shared/config/config-submission-forms.model';
import { FormFieldModel } from '../../../../../shared/form/builder/models/form-field.model';
import { AccessConditionOption } from '../../../../../core/shared/config/config-access-condition-option.model';

@Component({
  selector: 'ds-submission-upload-section-file-edit',
  templateUrl: './file-edit.component.html',
})
export class UploadSectionFileEditComponent implements OnChanges {

  @Input() availableAccessConditionOptions: any[];
  @Input() availableAccessConditionGroups: Map<string, any>;
  @Input() collectionPolicyType;
  @Input() configMetadataForm: SubmissionFormsModel;
  @Input() fileData: WorkspaceitemSectionUploadFileObject;
  @Input() fileId;
  @Input() fileIndex;
  @Input() formId;
  @Input() sectionId;
  @Input() submissionId;

  public formModel: DynamicFormControlModel[];

  constructor(private formBuilderService: FormBuilderService) {
  }

  ngOnChanges() {
    if (this.fileData && this.formId) {
      console.log(this.configMetadataForm);
      this.formModel = this.buildFileEditForm();
    }
  }

  protected buildFileEditForm() {
    // TODO check in the rest serve configuration whether dc.description may be repeatable
    const configDescr: FormFieldModel = Object.assign({}, this.configMetadataForm.rows[ 0 ].fields[ 0 ]);
    configDescr.repeatable = false;
    const configForm = Object.assign({}, this.configMetadataForm, {
      fields: Object.assign([], this.configMetadataForm.rows[ 0 ].fields[ 0 ], [
        this.configMetadataForm.rows[ 0 ].fields[ 0 ],
        configDescr
      ])
    });
    const formModel: DynamicFormControlModel[] = [];
    const metadataGroupModelConfig = Object.assign({}, BITSTREAM_METADATA_FORM_GROUP_CONFIG);
    metadataGroupModelConfig.group = this.formBuilderService.modelFromConfiguration(configForm, this.fileData.metadata);
    formModel.push(new DynamicFormGroupModel(metadataGroupModelConfig, BITSTREAM_METADATA_FORM_GROUP_CLS));
    const accessConditionTypeModelConfig = Object.assign({}, BITSTREAM_FORM_ACCESS_CONDITION_TYPE_CONFIG);
    const accessConditionsArrayConfig = Object.assign({}, BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_CONFIG);
    const accessConditionTypeOptions = [];

    if (this.collectionPolicyType === POLICY_DEFAULT_WITH_LIST) {
      for (const accessCondition of this.availableAccessConditionOptions) {
        accessConditionTypeOptions.push(
          {
            label: accessCondition.name,
            value: accessCondition.name
          }
        );
      }
      accessConditionTypeModelConfig.options = accessConditionTypeOptions;

      // Dynamic assign of relation in config. For startdate, endDate, groups.
      const hasStart = [];
      const hasEnd = [];
      const hasGroups = [];
      this.availableAccessConditionOptions.forEach((condition) => {
        const showStart: boolean = condition.hasStartDate === true;
        const showEnd: boolean = condition.hasEndDate === true;
        const showGroups: boolean = showStart || showEnd;
        if (showStart) {
          hasStart.push({ id: 'name', value: condition.name });
        }
        if (showEnd) {
          hasEnd.push({ id: 'name', value: condition.name });
        }
        if (showGroups) {
          hasGroups.push({ id: 'name', value: condition.name });
        }
      });
      const confStart = { relation: [ { action: 'ENABLE', connective: 'OR', when: hasStart } ] };
      const confEnd = { relation: [ { action: 'ENABLE', connective: 'OR', when: hasEnd } ] };
      const confGroup = { relation: [ { action: 'ENABLE', connective: 'OR', when: hasGroups } ] };

      accessConditionsArrayConfig.groupFactory = () => {
        const type = new DynamicSelectModel(accessConditionTypeModelConfig, BITSTREAM_FORM_ACCESS_CONDITION_TYPE_CLS);
        const startDateConfig = Object.assign({}, BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_CONFIG, confStart);
        const endDateConfig = Object.assign({}, BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_CONFIG, confEnd);
        const groupsConfig = Object.assign({}, BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CONFIG, confGroup);

        const startDate = new DynamicDatePickerModel(startDateConfig, BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_CLS);
        const endDate = new DynamicDatePickerModel(endDateConfig, BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_CLS);
        const groups = new DynamicSelectModel(groupsConfig, BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CLS);

        return [ type, startDate, endDate, groups ];
      };

      // Number of access conditions blocks in form
      accessConditionsArrayConfig.initialCount = isNotEmpty(this.fileData.accessConditions) ? this.fileData.accessConditions.length : 1;
      formModel.push(
        new DynamicFormArrayModel(accessConditionsArrayConfig, BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_CLS)
      );

    }
    this.initModelData(formModel);
    return formModel;
  }

  public initModelData(formModel: DynamicFormControlModel[]) {
    console.log(formModel);
    this.fileData.accessConditions.forEach((accessCondition, index) => {
      Array.of('name', 'groupUUID', 'startDate', 'endDate')
        .filter((key) => accessCondition.hasOwnProperty(key))
        .forEach((key) => {
          const metadataModel: any = this.formBuilderService.findById(key, formModel, index);
          if (metadataModel) {
            if (key === 'groupUUID') {
              this.availableAccessConditionGroups.forEach((group) => {
                metadataModel.options.push({
                  label: group.name,
                  value: group.uuid
                })
              });
            }
            metadataModel.value = accessCondition[key];
          }
        });
    });
  }

  public onChange(event: DynamicFormControlEvent) {
    if (event.model.id === 'name') {
      this.setOptions(event.model, event.control);
    }
  }

  public setOptions(model, control) {
    let accessCondition: AccessConditionOption = null;
    this.availableAccessConditionOptions.filter((element) => element.name === control.value)
      .forEach((element) => accessCondition = element);
    if (isNotEmpty(accessCondition)) {
      const showGroups: boolean = accessCondition.hasStartDate === true || accessCondition.hasEndDate === true;

      const groupControl = control.parent.get('groupUUID');
      const startDateControl = control.parent.get('startDate');
      const endDateControl = control.parent.get('endDate');

      // Clear previous values
      if (showGroups) {
        groupControl.setValue(null);
      } else {
        groupControl.setValue(accessCondition.groupUUID);
      }
      startDateControl.setValue(null);
      control.parent.markAsDirty();
      endDateControl.setValue(null);

      if (showGroups) {
        if (isNotUndefined(accessCondition.groupUUID)) {

          const groupOptions = [];
          if (isNotUndefined(this.availableAccessConditionGroups.get(accessCondition.groupUUID))) {
            const groupModel = this.formBuilderService.findById(
              'groupUUID',
              (model.parent as DynamicFormArrayGroupModel).group) as DynamicSelectModel<any>;

            this.availableAccessConditionGroups.forEach((group) => {
              groupOptions.push({
                label: group.name,
                value: group.uuid
              })
            });

            // Due to a bug can't dynamically change the select options, so replace the model with a new one
            const confGroup = { relation: groupModel.relation };
            const groupsConfig = Object.assign({}, BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CONFIG, confGroup);
            groupsConfig.options = groupOptions;
            model.parent.group.pop();
            model.parent.group.push(new DynamicSelectModel(groupsConfig, BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CLS));
          }

        }
        if (accessCondition.hasStartDate) {
          const startDateModel = this.formBuilderService.findById(
            'startDate',
            (model.parent as DynamicFormArrayGroupModel).group) as DynamicDateControlModel;

          startDateModel.min = new Date(accessCondition.maxStartDate);
        }
        if (accessCondition.hasEndDate) {
          const endDateModel = this.formBuilderService.findById(
            'endDate',
            (model.parent as DynamicFormArrayGroupModel).group) as DynamicDateControlModel;

          endDateModel.max = new Date(accessCondition.maxEndDate);
        }
      }
    }
  }

}
