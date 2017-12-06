import {Component, Input, SimpleChanges, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SectionUploadService} from '../section-upload.service';
import {hasValue, isNotEmpty, isNotUndefined} from '../../../../shared/empty.util';
import {
  DynamicDateControlModel,
  DynamicDatePickerModel,
  DynamicFormArrayGroupModel,
  DynamicFormArrayModel,
  DynamicFormControlEvent,
  DynamicFormControlModel,
  DynamicSelectModel
} from '@ng-dynamic-forms/core';
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
  BITSTREAM_METADATA_FORM_MODEL
} from './files-edit.model';
import {FormComponent} from '../../../../shared/form/form.component';
import {FormService} from '../../../../shared/form/form.service';
import {FormBuilderService} from '../../../../shared/form/builder/form-builder.service';
import {JsonPatchOperationsBuilder} from '../../../../core/json-patch/builder/json-patch-operations-builder';
import {SubmissionRestService} from '../../../submission-rest.service';
import {JsonPatchOperationPathCombiner} from '../../../../core/json-patch/builder/json-patch-operation-path-combiner';
import {FormArray, FormGroup} from "@angular/forms";
import {setOptions} from "marked";

@Component({
  selector: 'ds-submission-submit-form-box-files-edit',
  templateUrl: './files-edit.component.html',
})
export class FilesEditComponent {

  // The 'ViewChild' maps the variable only after the view init. And be sure to do not put the
  // ref inside an *ngIf or the output will be null until that part of HTML will be rendered.
  @ViewChild('formRef') formRef: FormComponent;

  @Input() fileId;
  @Input() fileIndex;
  @Input() sectionId;
  @Input() submissionId;
  @Input() configUrl;
  @Input() accessConditions: any[];
  @Input() accessConditionGroups;
  public fileData;
  public formId;
  public readMode = true;
  public initialized = false;
  public formModel: DynamicFormControlModel[];

  protected pathCombiner: JsonPatchOperationPathCombiner;
  protected subscriptions = [];

  constructor(private formService: FormService,
              private formBuilderService: FormBuilderService,
              private modalService: NgbModal,
              private operationsBuilder: JsonPatchOperationsBuilder,
              private restService: SubmissionRestService,
              private uploadService: SectionUploadService,) {
  }

  ngOnInit() {
    // TODO Use this when server is ok
    // this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionId, 'files', this.fileIndex);
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionId, this.fileIndex);

    // Retrieve the uploaded file
    this.subscriptions.push(
      this.uploadService
        .getFileData(this.submissionId, this.sectionId, this.fileId)
        .filter((bitstream) => isNotUndefined(bitstream))
        // .take(1)
        .subscribe((bitstream) => {
            this.fileData = bitstream;
            this.formId = 'form_' + this.fileId;
            this.formModel = this.buildBitstreamEditForm();
          }
        ));

  }

  protected buildBitstreamEditForm() {
    const formModel = Object.create(BITSTREAM_METADATA_FORM_MODEL);
    const accessConditionTypeModel = Object.create(BITSTREAM_FORM_ACCESS_CONDITION_TYPE_CONFIG);
    const accessConditionsArrayConfig = Object.create(BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_CONFIG);
    const accessConditionTypeOptions = [];



    // if (this.accessConditions.length > 0) {
      for (const accessCondition of this.accessConditions) {
        accessConditionTypeOptions.push(
          {
            label: accessCondition.name,
            value: accessCondition.name
          }
        );
      }
      accessConditionTypeModel.options = accessConditionTypeOptions;

      // Dynamic assign of relation in config. For startdate, endDate, groups.
      const hasStart = [];
      const hasEnd = [];
      const hasGroups = [];
      this.accessConditions.forEach((condition) => {
        const showStart: boolean = condition.hasStartDate === true;
        const showEnd: boolean = condition.hasEndDate === true;
        const showGroups: boolean = showStart || showEnd;
        if (showStart) {
          hasStart.push({id: 'name', value: condition.name});
        }
        if (showEnd) {
          hasEnd.push({id: 'name', value: condition.name});
        }
        if (showGroups) {
          hasGroups.push({id: 'name', value: condition.name});
        }
      });
      const confStart = {relation: [{action: 'ENABLE', connective: 'OR', when: hasStart}]};
      const confEnd = {relation: [{action: 'ENABLE', connective: 'OR', when: hasEnd}]};
      const confGroup = {relation: [{action: 'ENABLE', connective: 'OR', when: hasGroups}]};

      accessConditionsArrayConfig.groupFactory = () => {
        const type = new DynamicSelectModel(accessConditionTypeModel, BITSTREAM_FORM_ACCESS_CONDITION_TYPE_CLS);
        const startDateConfig = Object.assign(BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_CONFIG, confStart);
        const endDateConfig = Object.assign(BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_CONFIG, confEnd);
        const groupsConfig = Object.assign(BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CONFIG, confGroup);

        const startDate = new DynamicDatePickerModel(startDateConfig, BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_CLS);
        const endDate = new DynamicDatePickerModel(endDateConfig, BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_CLS);
        const groups = new DynamicSelectModel(groupsConfig, BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CLS);
        return [type, startDate, endDate, groups];
      };

      //Number of access conditions blocks in form
      let repeat = this.fileData.accessConditions.length;
      repeat = (repeat == 0) ? 1 : repeat;

      accessConditionsArrayConfig.initialCount = repeat;
      formModel.push(
        new DynamicFormArrayModel(accessConditionsArrayConfig, BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_CLS)
      );

    // }
    return formModel;
  }

  public setFormInitialMetadata() {
    if (!this.initialized) {
      this.initialized = true;
      // Alternative mode to assign:
      // this.formRef.formGroup.controls['files-data'].controls.title.setValue(...);
      // Cannot put the following lines into 'ngOnInit' because 'this.formRef' is available only after the view init.
      // Cannot put the following lines into 'ngAfterViewInit' because of 'ExpressionChangedAfterItHasBeenCheckedError'.

      // TODO  bitstreamList[key].metadata['dc.title'][0].value, as in section-upload
      // dc.title
      let title = '';
      if (isNotUndefined(this.fileData.metadata['dc.title'])) {
        // Case /edit
        title = this.fileData.metadata['dc.title'][0].value;
      } else {
        // Case /submit
        title = this.fileData.metadata[0].value;
      }

      const description = this.fileData.metadata.length > 1 ? this.fileData.metadata[1].value : '';
      const accessConditions = this.fileData.accessConditions;


      this.fileData.accessConditions.forEach( (condition, index) => {

        const accessConditionControl: any = this.formBuilderService.getFormControlById(
          'accessConditions',
          this.formRef.formGroup,
          this.formModel,
          index);
        // let accessConditionControl = (this.formRef.formGroup.get('accessConditions') as FormArray).controls[0] as FormGroup;

        // if(index > 0 && (this.formRef.formGroup.get('accessConditions') as FormArray).controls.length === 1) {
        //   accessConditionControl = Object.create(accessConditionControl);
        //   (this.formRef.formGroup.get('accessConditions') as FormArray).controls.push(accessConditionControl);
        // }

        if (accessConditionControl) {
          // console.log('index: '+index);
          const controls = Object.keys(accessConditionControl.controls);
          controls.forEach( (key) => {
            // console.log(key+': '+condition[key]);

            accessConditionControl.get(key).setValue(condition[key]);
            if(key === 'name') {
              const model = this.formBuilderService.findById(key, this.formModel, index);
              this.setOptions(model, accessConditionControl.get(key));
            }
          });
        }
      });

      this.formRef.formGroup.get('metadata').get('dc_title').setValue(title);
      this.formRef.formGroup.get('metadata').get('dc_description').setValue(description);
    }
  }

  public switchMode(mode: boolean) {
    // this.formModel = this.buildBitstreamEditForm();
    this.setFormInitialMetadata();
    this.readMode = mode;
  }

  ngOnChanges() {
    // Retrieve the uploaded file, for update form access conditions
    if(this.accessConditions) {
      this.subscriptions.push(
        this.uploadService
          .getFileData(this.submissionId, this.sectionId, this.fileId)
          .filter((bitstream) => isNotUndefined(bitstream))
          // .take(1)
          .subscribe((bitstream) => {
              this.fileData = bitstream;
              this.formId = 'form_' + this.fileId;
              this.formModel = this.buildBitstreamEditForm();
            }
          ));
    }
  }

  public onChange(event: DynamicFormControlEvent) {
    if (event.model.id === 'name') {
      const model = this.formBuilderService.findById(event.model.id, this.formModel);
      // model.parent = this.formBuilderService.findById('accessConditions', this.formModel);
      // this.setOptions(event.model, event.control);
      this.setOptions(model, event.control);
    }
  }

  public setOptions(model, control) {
    const accessCondition = this.accessConditions.filter((element) => element.name === control.value);
    if (isNotEmpty(accessCondition)) {
      const showGroups: boolean = accessCondition[0].hasStartDate === true || accessCondition[0].hasEndDate === true;

      if (isNotUndefined(accessCondition[0].groupUUID)) {
        // const hiddenGroupControl = event.group.get('hiddenGroupUUID');
        const groupModel = this.formBuilderService.findById(
          'groupUUID',
          (model.parent as DynamicFormArrayGroupModel).group) as DynamicSelectModel<any>;

        if (isNotUndefined(this.accessConditionGroups[accessCondition[0].groupUUID])) {
          groupModel.options = [
            {
              label: this.accessConditionGroups[accessCondition[0].groupUUID].name,
              value: this.accessConditionGroups[accessCondition[0].groupUUID].uuid
            }
          ];
        } else {
          groupModel.options = []
        }

        if (showGroups) {
          if (accessCondition[0].hasStartDate) {
            const startDateModel = this.formBuilderService.findById(
              'startDate',
              (model.parent as DynamicFormArrayGroupModel).group) as DynamicDateControlModel;
            startDateModel.min = new Date(accessCondition[0].maxStartDate);
          }
          if (accessCondition[0].hasEndDate) {
            const endDateModel = this.formBuilderService.findById(
              'endDate',
              (model.parent as DynamicFormArrayGroupModel).group) as DynamicDateControlModel;
            endDateModel.max = new Date(accessCondition[0].maxEndDate);
          }
        }
      }
    }
    const path = this.formBuilderService.getPath(model);
    const segmentpath = this.pathCombiner.getPath(this.formBuilderService.getPath(model));
    console.log('p', path, 's', segmentpath);
  }

  public deleteBitstream() {
    this.uploadService.deleteBitstream(this.submissionId, this.sectionId, this.fileId);
    this.operationsBuilder.remove(this.pathCombiner.getPath());
    this.restService.jsonPatchByResourceID(
      this.submissionId,
      this.pathCombiner.rootElement,
      this.pathCombiner.subRootElement)
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
            const formData = this.formRef.formGroup.value;
            const metadatum = [];
            Object.keys((formData.metadata))
              .forEach((key) => {
                const keyDot = key.replace(/\_/g, '.');
                metadatum.push({key: keyDot, value: formData.metadata[key]})
              });

            const fileData = Object.assign({}, this.fileData, {
              metadata: metadatum,
              accessConditions: formData.accessConditions
            });
            const titlePath = `metadata/dc.title`;
            const descriptionPath = `metadata/dc.description`;
            const accessConditionPath = `accessConditions`;
            /*const accessCondition = [
              { name: formData['files-policies'][0].policies,
                groupUUID: '3522e898-fe96-45ea-8538-65f1cf9128a8',
                endDate: null }];*/
            this.operationsBuilder.replace(this.pathCombiner.getPath(titlePath), formData.metadata.dc_title);
            this.operationsBuilder.replace(this.pathCombiner.getPath(descriptionPath), formData.metadata.dc_description);
            formData.accessConditions.forEach( (condition) => {
              this.operationsBuilder.add(this.pathCombiner.getPath(accessConditionPath), condition, true);
            });

            this.restService.jsonPatchByResourceID(
              this.submissionId,
              this.pathCombiner.rootElement,
              this.pathCombiner.subRootElement)
              .subscribe();
            this.uploadService.editBitstream(this.submissionId, this.sectionId, this.fileId, fileData);

          } else {
            this.formService.validateAllFormFields(this.formRef.formGroup);
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
